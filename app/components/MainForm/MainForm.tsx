'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@app/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@app/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@app/components/ui/accordion';
import { Input } from '@app/components/ui/input';
import { useContext, useState } from 'react';

import UserDataContext from '@app/context/UserDataContext';
import ShorteningResults from './ShorteningResults';

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
  const [isLoading, setIsLoading] = useState(false);
  const { setPrevUrls, userData } = useContext(UserDataContext);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: '',
      custom: '',
      linkpass: '',
      maxclicks: '' as any,
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
        since: Date.parse(new Date(values.since as string).toUTCString()),
        till: Date.parse(new Date(values.till as string).toUTCString()),
        guestId: userData.guestId,
        token: userData.token
      })
    });
    const data = await response.json();

    if (data?.status === 'error') {
      form.setError('url', { type: 'custom', message: data.message });
      if (data.shortUrlObj) {
        setShortLinkData(data.shortUrlObj);
      }
      return setIsLoading(false);
    }
    form.reset();
    setShortLinkData(data.shortUrlObj);
    setPrevUrls((prev: any) => {
      return [
        {
          shorturl: data.shortUrlObj.shorturl,
          fullurl: data.shortUrlObj.fullurl,
          clicks: 0
        },
        ...prev
      ];
    });
    setIsLoading(false);
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
            <ShorteningResults shortLinkData={shortLinkData} />
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
