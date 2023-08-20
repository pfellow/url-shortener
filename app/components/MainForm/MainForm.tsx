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
import HoverCardInstance from '../Hover';
import Loader from '../Loader';

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
  maxclicks: z.union([
    z.coerce.number().positive(),
    z.string().length(0).optional()
  ]),
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
    <section className='sm:mt-10 mx-auto max-w-[700px] p-2 w-full flex flex-col gap-8 items-center'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='w-full'>
          <div
            className='flex sm:flex-row flex-col
          sm:items-start gap-2 w-full'
          >
            <FormField
              control={form.control}
              name='url'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormLabel>
                    <HoverCardInstance
                      title='Enter URL'
                      content='Just enter a long URL and click "Shorten"'
                    />
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='https://google.com'
                      {...field}
                      className='w-full'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='sm:mt-7'>
              Shorten
            </Button>
          </div>
          <div className='my-4 flex flex-col gap-1'>
            {isLoading && <Loader />}
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
                      <FormLabel>
                        <HoverCardInstance
                          title='Custom Link'
                          content='3-12 characters, case-sensitive (letters, numbers and -)'
                        />
                      </FormLabel>
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
                      <FormLabel>
                        <HoverCardInstance
                          title='Link Password'
                          content='3-18 characters, case-sensitive'
                        />
                      </FormLabel>
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
                      <FormLabel>
                        <HoverCardInstance
                          title='Max Clicks'
                          content='Maximum number of clicks, > 0'
                        />
                      </FormLabel>
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
                      <FormLabel>
                        <HoverCardInstance
                          title='Valid Since'
                          content='Date/time when the link becomes active (your local time)'
                        />
                      </FormLabel>
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
                      <FormLabel>
                        <HoverCardInstance
                          title='Valid Till'
                          content='Date/time when the link becomes no longer active (your local time)'
                        />
                      </FormLabel>
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
    </section>
  );
};

export default MainForm;
