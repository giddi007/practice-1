"use client";

import React, { useActionState, useState } from 'react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea';
import MDEditor from '@uiw/react-md-editor';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import { formSchema } from '@/lib/validation';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { createPitch } from '@/lib/actions';
import { useRouter } from 'next/navigation';


const StartupForm = () => {
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [pitch, setPitch] = useState("");
    const { toast } = useToast();
    const router = useRouter();

    // toast ({
    //     title: "Success",
    //     description: "Your startup pitch has been created successfully",
    // });


    const handleSubmit = async (prevState: any, formData: FormData) => {
        try {
            const formValues = {
                title: formData.get('title') as string,
                description: formData.get('description') as string,
                category: formData.get('category') as string,
                link: formData.get('link') as string,
                pitch,
            };

            await formSchema.parseAsync(formValues);

            // console.log(formValue);

            const result = await createPitch(prevState, formData, pitch);

            if (result.status == "SUCCESS") {
                toast({
                  title: "Success",
                  description: "Your startup pitch has been created successfully",
                });

                router.push(`/startup/${result._id}`);
            }    
            
            return result;
        } catch (error) {
            if(error instanceof z.ZodError) {
                const fieldErrors = error.flatten().fieldErrors;

                setErrors(fieldErrors as unknown as Record<string, string>);

                toast ({
                    title: 'Error',
                    description: 'please check your inputs and try again',
                    variant: 'destructive',
                })

                return { ...prevState, error: "validation failed", status: 'ERROR' }
            };

            return {
                ...prevState,
                error: "an unexpected error has occured",
                status: 'ERROR',
            }
        } 
    }


    const [state, formAction, isPending] = useActionState(handleSubmit,{
        error:'',
        status:'INITIAL',
    })


  return (
    <form action={formAction} className="startup-form">
        <div>
            <label htmlFor="title" className='startup-form_label'>
                title
            </label>
            <Input 
                id='title' 
                name='title' 
                className='startup-form_input'
                required
                placeholder='Startup title'
            />

            {errors.title && <p className='startup-form_error'>{errors.title}</p>}
        </div>

        <div>
            <label htmlFor="description" className='startup-form_label'>
                Description
            </label>
            <Textarea 
                id='description' 
                name='description' 
                className='startup-form_textarea'
                required
                placeholder='Startup description'
            />

            {errors.description && <p className='startup-form_error'>{errors.description}</p>}
        </div>

        <div>
            <label htmlFor="category" className='startup-form_label'>
                category
            </label>
            <Input 
                id='category' 
                name='category' 
                className='startup-form_input'
                required
                placeholder='Startup category (Tech, Health, Education, etc...)'
            />

            {errors.category && <p className='startup-form_error'>{errors.title}</p>}
        </div>

        <div>
            <label htmlFor="Link" className='startup-form_label'>
                image URL
            </label>
            <Input 
                id='link' 
                name='link' 
                className='startup-form_input'
                required
                placeholder='Startup Image URL'
            />

            {errors.link && <p className='startup-form_error'>{errors.link}</p>}
        </div>

        <div data-color-mode="light">
            <label htmlFor="pitch" className='startup-form_label'>
                pitch
            </label>

            <MDEditor
             value={pitch}
             onChange={(value) => setPitch(value as string)}
             id='pitch'
             preview='edit'
             height={300}
             style={{borderRadius: 20, overflow: "hidden"}}
             textareaProps={{
                placeholder: 'briefly describe your idea and what problem it solves',
             }}
             previewOptions={{
                disallowedElements: ['style'],
             }}
            />

            {errors.pitch && <p className='startup-form_error'>{errors.pitch}</p>}
        </div>

        <Button 
            type='submit' 
            className='startup-form_btn text-white' 
            disabled={isPending}
        >
            {isPending ? 'Submitting...' : 'Submit your pitch'}
            <Send className='size-6 ml-2' />
        </Button>
    </form>
  )
}

export default StartupForm