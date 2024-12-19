import React, { useContext, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { UserContext } from "@/context/userContext";
import { EyeIcon, EyeOffIcon } from "lucide-react";


const API = import.meta.env.VITE_BACKEND_URI;

function Login() {
  const [input, setInput] = useState({
    email: "",
    password: ""
  });
  const [isToggled, setIsToggled] = useState(false);
  const [inputType, setInputType] = useState("password");

  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    setInputType("password");
    setIsToggled("false");
    e.preventDefault(); // prevent the default behaviour of the form

    setLoading(true); // Set loading to true when submission starts

    const data = {
      email: input.email,
      password: input.password
    };

    axios
      .post(`${API}/api/v1/user/login`, data, {
        withCredentials: true
      })
      .then((response) => {
        // Handle success
        toast({
          variant: "success",
          description: response.data.message
        });
        const user = response.data.user;

        // Store user info in local storage
        localStorage.setItem("userInfo", JSON.stringify(user));
        setUser(user);
        // Redirect to chats
        navigate("/chats");
      })
      .catch((error) => {
        console.log("Axios Error: ", error);
        if (error.response) {
          toast({
            variant: "destructive",
            description: error.response.data.message,
            action: <ToastAction altText="Try again">Try again</ToastAction>
          });
        }
      })
      .finally(() => {
        setLoading(false); // Set loading to false when request is finished
      });
  };
  // Password Hide/Show handler
  const handleTypeChange = () => {
    setIsToggled(!isToggled);
    setInputType(inputType == "password" ? "text" : "password");
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput, // Spread the previous input state
      [name]: value // Update only the changed field (name, email, or password)
    }));
  };

  return (
    <div className="flex justify-center items-center h-[100vh] bg-gradient-to-b from-pink-100 to-rose-50 text-gray-800">
      <Card className="w-[90%] max-w-md">
        <CardHeader className="items-center font-semibold text-2xl">
          Log In to 
          <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-red-400 to-yellow-300 animate-pulse">
            GiggleChat
          </span>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="xyz@gmail.com"
            value={input.email}
            onChange={handleInputChange}
            autoComplete="email"
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
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button
            type="submit"
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Submit"}
          </Button>
          <div>
            <p>
              If not registered?{" "}
              <Link
                className="text-rose-500 font-semibold hover:underline"
                to={"/verify-email"}
              >
                Sign Up
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
