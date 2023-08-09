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
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';

const formSchema = z.object({
  url: z.string().url()
});

const MainForm = () => {
  const [shortLink, setShortLink] = useState();
  const [userId, setUserId] = useState('');

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
      url: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await fetch('/api/shorten', {
      method: 'POST',
      body: JSON.stringify({ url: values.url, userId: userId })
    });
    const data = await response.json();
    setShortLink(data.shortURL.shorturl);
  };

  return (
    <div className='mx-auto max-w-[800px] p-6 w-full flex flex-col gap-8 items-center'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex sm:flex-row flex-col sm:justify-center sm:items-start gap-2 w-full' //space-y-4
        >
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
                    className='sm:w-[450px] w-full'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='sm:mt-8'>
            Shorten
          </Button>
        </form>
      </Form>
      {shortLink && <p>{shortLink}</p>}
    </div>
  );
};

export default MainForm;
