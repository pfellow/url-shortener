'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { useContext, useEffect, useState } from 'react';

import UserDataContext from '@app/context/UserDataContext';

const formSchema = z.object({
  url: z.string().url(),
  custom: z.union([
    z
      .string()
      .min(3)
      .max(12)
      .regex(/[a-zA-z0-9]/),
    z.string().length(0).optional()
  ]),
  linkpass: z.union([
    z.string().min(3).max(18),
    z.string().length(0).optional()
  ]),
  maxclicks: z.coerce.number().nonnegative().optional(),
  since: z.string().optional(),
  till: z.string().optional()
});

const MainForm = () => {
  const [shortLinkData, setShortLinkData] = useState({});
  const [userData, setUserData] = useState({
    guestId: '',
    token: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { prevUrls, setPrevUrls } = useContext(UserDataContext);

  useEffect(() => {
    const userData = localStorage.getItem('ogogl') || '{}';
    const userDataId = JSON.parse(userData)?.guestId;
    const userToken = JSON.parse(userData)?.token;
    const userTokenExp = JSON.parse(userData)?.tokenexp || 0;

    const getUserData = async () => {
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        body: JSON.stringify({
          guestId: userDataId
        })
      });
      const newUserData = await response.json();

      setUserData({
        guestId: newUserData.guestId,
        token: newUserData.token
      });
      return localStorage.setItem(
        'ogogl',
        JSON.stringify({
          guestId: newUserData.guestId,
          token: newUserData.token,
          tokenexp: Date.now() + 3 * 60 * 60000
        })
      );
    };

    if (!userDataId || !userToken || userTokenExp < Date.now()) {
      getUserData();
    }
    setUserData({ guestId: userDataId, token: userToken });
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      custom: '',
      linkpass: '',
      maxclicks: '',
      since: '',
      till: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setShortLinkData({});
    setIsLoading(true);
    const response = await fetch('/api/shorten', {
      method: 'POST',
      body: JSON.stringify({
        fullurl: values.url,
        custom: values.custom,
        linkpass: values.linkpass,
        maxclicks: values.maxclicks,
        since: Date.parse(new Date(values.since).toUTCString()),
        till: Date.parse(new Date(values.till).toUTCString()),
        guestId: userData.guestId,
        token: userData.token
      })
    });
    const data = await response.json();

    if (data.error) {
      form.setError('url', { type: 'custom', message: data.error });
      return setIsLoading(false);
    }
    form.reset();
    console.log(prevUrls); // DELETE
    setShortLinkData(data.shortUrlObj);
    setPrevUrls((prevUrls) => {
      return [
        {
          shorturl: data.shortUrlObj.shorturl,
          fullurl: data.shortUrlObj.fullurl,
          clicks: 0
        },
        ...prevUrls
      ];
    });
    setIsLoading(false);
    console.log(prevUrls); // DELETE
  };

  return (
    <div className='mx-auto max-w-[600px] p-6 w-full flex flex-col gap-8 items-center'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
          <div className='flex sm:flex-row flex-col sm:justify-between sm:items-start gap-2 w-full'>
            <FormField
              control={form.control}
              name='url'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='https://google.com'
                      {...field}
                      className='min-w-[450px]'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='sm:mt-6'>
              Shorten
            </Button>
          </div>
          <div className='my-4 flex flex-col gap-1'>
            {isLoading && <p>The URL is shortening...</p>}
            {shortLinkData.shorturl && (
              <p className='text-lg'>{shortLinkData.shorturl}</p>
            )}
            {shortLinkData.fullurl && (
              <p className='truncate'>{shortLinkData.fullurl}</p>
            )}
            {shortLinkData.maxclicks && (
              <p>Max Clicks: {shortLinkData.maxclicks}</p>
            )}
            {shortLinkData.linkpass && (
              <p>Password: {shortLinkData.linkpass}</p>
            )}
            {shortLinkData.since && (
              <p>
                Valid since: {new Date(shortLinkData.since).toLocaleString()}
              </p>
            )}
            {shortLinkData.till && (
              <p>Valid till: {new Date(shortLinkData.till).toLocaleString()}</p>
            )}
          </div>
          <Accordion type='single' collapsible>
            <AccordionItem value='item-1'>
              <AccordionTrigger>Advanced Options</AccordionTrigger>
              <AccordionContent className='flex flex-wrap justify-between gap-4 px-2 py-4'>
                <FormField
                  control={form.control}
                  name='custom'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Custom Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='cool'
                          {...field}
                          className='max-w-[180px]'
                        />
                      </FormControl>
                      <FormMessage className='max-w-[180px]' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='linkpass'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='password'
                          {...field}
                          className='max-w-[180px]'
                        />
                      </FormControl>
                      <FormMessage className='max-w-[180px]' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='maxclicks'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Clicks</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='100'
                          {...field}
                          className='max-w-[140px]'
                        />
                      </FormControl>
                      <FormMessage className='max-w-[140px]' />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='since'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valid Since</FormLabel>
                      <FormControl>
                        <Input type='datetime-local' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='till'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valid Till</FormLabel>
                      <FormControl>
                        <Input type='datetime-local' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </form>
      </Form>
    </div>
  );
};

export default MainForm;
