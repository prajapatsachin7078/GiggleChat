import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

function Login() {
    const [input, setInput] = useState({
        email: '',
        password: ''
    });
    const handleSubmit = (e) => {
        e.preventDefault(); // prevent the default behaviour of the form
        console.log(input)
    }
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
                    Log In
                </CardHeader>
                <CardContent>
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
                        <p>If not registered? <Link className='text-blue-600 border-b border-blue-600' to={'/signup'}>Sign Up</Link></p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default Login