'use client';

import { useContext, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select';

import UserDataContext from '../context/UserDataContext';

const formSchema = z.object({
  email: z.string().email(),
  name: z.union([z.string().min(2).max(30), z.string().length(0).optional()]),
  ogolink: z.string().optional(),
  message: z
    .string()
    .min(5, {
      message: 'Your message should contain more than 5 characters.'
    })
    .max(3000, {
      message: 'Your message should contain more than 3000 characters.'
    }),
  type: z.string()
});

export function Contact() {
  const { userData } = useContext(UserDataContext);
  const [isSending, setIsSending] = useState(false);
  const [formStatus, setFormStatus] = useState('');
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: '',
      ogolink: '',
      message: '',
      type: undefined
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSending(true);
      setFormStatus('Please wait...');
      const response = await fetch('/api/feedback', {
        method: 'PUT',
        body: JSON.stringify({
          data: values,
          guestId: userData.guestId,
          token: userData.token
        })
      });
      const data = await response.json();
      if ((data.status = 'error')) {
        setFormStatus(data.message);
      }
      if (data.ticket) {
        setFormStatus(`The message ${data.ticket} has been sent.`);
      }
    } catch (error) {
      setFormStatus('Unexpected error. Please try again later.');
    }
    setIsSending(false);
    form.reset({
      email: '',
      name: '',
      ogolink: '',
      message: '',
      type: undefined
    });
  }
  return (
    <section id='contact' className='mx-auto max-w-[620px] p-2 w-full'>
      <h2>Contact us</h2>
      <p>
        If you want to report us a bug, make a suggestion or complain about
        inappropriate or malicious link, please fill this form.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='John Smith'
                    {...field}
                    className='max-w-[300px]'
                  />
                </FormControl>
                <FormMessage></FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder='index@mail.com'
                    {...field}
                    className='max-w-[300px]'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='ogolink'
            render={({ field }) => (
              <FormItem>
                <FormLabel>oGo link</FormLabel>
                <FormControl>
                  <Input
                    type='text'
                    placeholder='ogo.gl/abcdef'
                    {...field}
                    className='max-w-[300px]'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your request type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className='max-w-[300px]'>
                      <SelectValue placeholder='Select the request type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='bug'>Report a bug</SelectItem>

                      <SelectItem value='suggestion'>Suggestion</SelectItem>
                      <SelectItem value='collaboration'>
                        Collaboration
                      </SelectItem>
                      <SelectItem value='complaint'>Complaint</SelectItem>
                      <SelectItem value='feedback'>Other feedback</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='message'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your message</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Type your message here'
                    rows={7}
                    {...field}
                    className='resize-none'
                  ></Textarea>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' disabled={isSending}>
            {!isSending ? 'Send' : 'Sending'}
          </Button>
          <div>{formStatus}</div>
        </form>
      </Form>
    </section>
  );
}

export default Contact;
