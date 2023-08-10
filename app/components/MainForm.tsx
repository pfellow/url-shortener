'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { nanoid } from 'nanoid';

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
import { useEffect, useState } from 'react';

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
  const [shortLink, setShortLink] = useState();
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('ogogl');
    const userDataId = JSON.parse(userData)?.userId;

    if (!userDataId) {
      const id = nanoid(16);
      setUserId(id);
      return localStorage.setItem('ogogl', JSON.stringify({ userId: id }));
    }

    setUserId(JSON.parse(userData).userId);
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
    setIsLoading(true);
    const response = await fetch('/api/shorten', {
      method: 'POST',
      body: JSON.stringify({
        url: values.url,
        custom: values.custom,
        linkpass: values.linkpass,
        maxclicks: values.maxclicks,
        since: values.since,
        till: values.till,
        userId: userId
      })
    });
    const data = await response.json();

    if (data.error) {
      form.setError('url', { type: 'custom', message: data.error });

      return;
    }
    form.reset();
    setShortLink(data.shortUrlObj.shorturl);
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
          {isLoading && <p>The URL is shortening...</p>}
          {shortLink && <p>{shortLink}</p>}
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
                      <FormLabel>Max Clicks</FormLabel>
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
                      <FormLabel>Max Clicks</FormLabel>
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
