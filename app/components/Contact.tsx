'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  ogolink: z.string().optional(),
  message: z.string().min(5),
  type: z.string()
});

export function Contact() {
  // 1. Define your form.
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    alert('The message has been sent!');
    form.reset();
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
                <FormMessage />
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
                    type='url'
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

          <Button type='submit'>Send</Button>
        </form>
      </Form>
    </section>
  );
}

export default Contact;
