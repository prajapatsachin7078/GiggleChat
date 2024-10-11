import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from '@/hooks/use-toast'

function SignUp() {
    const [input, setInput] = useState({
        name: '',
        email: '',
        password: '',
        avatar: ''
    });
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default behaviour of the form
        const data = {
            name: input.name.trim(),
            email: input.email.trim(),
            password: input.password.trim()
        }

        try {
            const response = await axios.post(
                "http://localhost:3000/api/v1/user/signup",
                data,
                {
                    withCredentials: true, // For cookies, etc.
                }
            );

            console.log("Response: ", response);

            // Handle different response statuses here
            if (response.status === 201) {
                // Handle success
                toast({
                    variant: "success",
                    description: response.data.message
                });
                navigate('/login');
            } else if (response.status === 400) {
                // Handle validation error
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: response.data.message,
                    action: <ToastAction altText="Try again">Try again</ToastAction>,
                });
            } else {
                // Handle other statuses if necessary
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: response.data.message,
                    action: <ToastAction altText="Try again">Try again</ToastAction>,
                });
            }

        } catch (error) {
            // Catch block for network errors or if Axios throws an error
            console.error("Error during sign-up: ", error);

            // Check if it's an Axios error and if it has a response
            if (error.response) {
                // Handle specific error response status codes here if needed
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: error.response.data.message || "An error occurred.",
                });
            } else {
                // Handle network errors (e.g., server down, no internet)
                toast({
                    variant: "destructive",
                    title: "Network Error",
                    description: "Please check your internet connection.",
                });
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setInput((prevInput) => ({
            ...prevInput,     // Spread the previous input state
            [name]: value   // Update only the changed field (name, email, or password)
        }));
    }
    return (
        <div className='flex justify-center align-middle items-center h-[100vh]'>
            <Card>
                <CardHeader className='items-center font-semibold text-2xl'>
                    Sign Up
                </CardHeader>
                <CardContent>
                    <Label htmlFor='name'>Name</Label>
                    <Input type='text' id="name" name='name' placeholder='Enter your name'
                        value={input.name}
                        onChange={handleInputChange}
                    />
                    <Label htmlFor='email'>Email</Label>
                    <Input type='email' id='email' name='email' placeholder='xyz@gmail.com'
                        value={input.email}
                        onChange={handleInputChange}
                    />
                    <Label htmlFor='password'>Password</Label>
                    <Input type='password' id='password' name='password'
                        value={input.password}
                        onChange={handleInputChange}
                    />
                </CardContent>
                <CardFooter className='flex flex-col space-y-3'>
                    <Button
                        type='submit'
                        className='w-full'
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>

                    <div>
                        <p>If already have an account? <Link className='text-blue-600 border-b border-blue-600' to={'/login'}>Sign in</Link></p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default SignUp