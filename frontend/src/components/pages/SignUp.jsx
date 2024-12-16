import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { API } from "@/lib/utils";
import { ToastAction } from "@radix-ui/react-toast";

function SignUp() {
  const [input, setInput] = useState({
    name: "",
    password: "",
    confirmPassword: ""
  });
  const [isToggled, setIsToggled] = useState(false);
  const [inputType, setInputType] = useState("password");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setInputType("password");
    setIsToggled(false);
    e.preventDefault(); // Prevent the default behaviour of the form

    // Confirm password before registering
    if (input.password !== input.confirmPassword) {
      // Handle validation error
      toast({
        variant: "destructive",
        title: "Password mismatch!",
        description: "Password and confirm password should be the same!",
        action: <ToastAction altText="Try again">Try again</ToastAction>
      });
      return;
    }

    // Fetch userId from localStorage
    const userId = localStorage.getItem("userId");
    localStorage.removeItem('userId');
    if (!userId) {
      toast({
        variant: "destructive",
        title: "User ID not found!",
        description: "Please make sure you are logged in.",
        action: <ToastAction altText="Try again">Try again</ToastAction>
      });
      return;
    }


    const data = {
      userId,
      name: input.name.trim(),
      password: input.password.trim()
    };

    try {
      const response = await axios.post(`${API}/api/v1/user/signup`, data, {
        withCredentials: true // For cookies, etc.
      });

      // Handle different response statuses here
      if (response.status === 200) {
        // Handle success
        toast({
          variant: "success",
          description: response.data.message
        });
        navigate("/login");
      } else if (response.status === 400) {
        // Handle validation error
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: response.data.message,
          action: <ToastAction altText="Try again">Try again</ToastAction>
        });
      } else {
        // Handle other statuses if necessary
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: response.data.message,
          action: <ToastAction altText="Try again">Try again</ToastAction>
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
          description: error.response.data.message || "An error occurred."
        });
      } else {
        // Handle network errors (e.g., server down, no internet)
        toast({
          variant: "destructive",
          title: "Network Error",
          description: "Please check your internet connection."
        });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setInput((prevInput) => ({
      ...prevInput, // Spread the previous input state
      [name]: value // Update only the changed field (name or password)
    }));
  };

  // Password Hide/Show handler
  const handleTypeChange = () => {
    setIsToggled(!isToggled);
    setInputType(inputType === "password" ? "text" : "password");
  };

  return (
    <div className="flex justify-center items-center h-[100vh] bg-gradient-to-b from-pink-100 to-rose-50 text-gray-800">
      <Card className="w-[90%] max-w-md">
        <CardHeader className="items-center font-semibold text-2xl text-center">
          Complete your registration for{" "}
          <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-red-400 to-yellow-300 animate-pulse">
            GiggleChat
          </span>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            value={input.name}
            onChange={handleInputChange}
            className="border border-gray-300"
          />
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              type={inputType}
              id="password"
              name="password"
              value={input.password}
              onChange={handleInputChange}
              className="border border-gray-300"
            />
            <span
              className="absolute top-2.5 right-2 hover:cursor-pointer"
              onClick={handleTypeChange}
            >
              {isToggled ? (
                <EyeIcon className="text-gray-500 w-5 h-5" />
              ) : (
                <EyeOffIcon className="text-gray-500 w-5 h-5" />
              )}
            </span>
          </div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              type={inputType}
              id="confirmPassword"
              name="confirmPassword"
              value={input.confirmPassword}
              onChange={handleInputChange}
              className="border border-gray-300"
            />
            <span
              className="absolute top-2.5 right-2 hover:cursor-pointer"
              onClick={handleTypeChange}
            >
              {isToggled ? (
                <EyeIcon className="text-gray-500 w-5 h-5" />
              ) : (
                <EyeOffIcon className="text-gray-500 w-5 h-5" />
              )}
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold"
            onClick={handleSubmit}
          >
            Register
          </Button>
          <div>
            <p>
              Already have an account?{" "}
              <Link
                className="text-rose-500 font-semibold hover:underline"
                to={"/login"}
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SignUp;
