import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { API } from "@/lib/utils";
import { Card, CardHeader, CardContent, CardFooter } from "../ui/card"; // assuming you have a card component

function VerifyUserEmail() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [timer, setTimer] = useState(60);
  const [timerId, setTimerId] = useState(null); // Store the interval ID

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  };

  const startTimer = () => {
    // Clear any previous interval if there is any
    if (timerId) {
      clearInterval(timerId);
    }
    const id = setInterval(() => {
      setTimer((timer) => {
        if (timer === 0) {
          clearInterval(id);
          return 0;
        }
        return timer - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    setTimer(60);
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");

    try {
      const response = await axios.post(`${API}/api/v1/user/verify-email`, {
        email
      });
      if (response.data.success) {
        setOtpSent(true);
        toast({
          variant: "default",
          title: "OTP Sent",
          description: "Check your email for the OTP."
        });
        startTimer();
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: response.data.message,
          action: <ToastAction altText="Try again">Try again</ToastAction>
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Error sending OTP. Please check your network and try again.",
        action: <ToastAction altText="Try again">Try again</ToastAction>
      });
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6 || isNaN(otp)) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP."
      });
      return;
    }

    try {
      const response = await axios.post(`${API}/api/v1/user/verify-otp`, {
        email,
        otp
      });
      if (response.data.success) {
        navigate("/signup");
        toast({
          variant: "default",
          title: "Success",
          description: "OTP verified successfully."
        });
        localStorage.setItem('userId',response.data.userId);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid OTP",
          description: response.data.message,
          action: <ToastAction altText="Try again">Try again</ToastAction>
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Error verifying OTP. Please check your network and try again.",
        action: <ToastAction altText="Try again">Try again</ToastAction>
      });
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    return () => {
      // Clean up the interval when the component unmounts
      if (timerId) clearInterval(timerId);
    };
  }, [timerId, timer]);

  return (
    <div className="flex justify-center items-center h-[100vh] bg-gradient-to-b from-pink-100 to-rose-50 text-gray-800">
      <Card className="w-[90%] max-w-md">
        <CardHeader className="items-center font-semibold text-2xl">
          Verify Your Email
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            Please enter your email and OTP to proceed with registration.
          </p>
          {!otpSent ? (
            <div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`mt-1 block w-full border ${
                    emailError ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
              </div>
              <Button
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-md"
                onClick={handleSendOtp}
              >
                Send OTP
              </Button>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  Enter OTP
                </label>
                <Input
                  type="text"
                  id="otp"
                  value={otp}
                  disabled={timer === 0 ? true : false}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <span className="h-20">
                  {timer === 60
                    ? "01:00"
                    : timer < 10
                    ? `00:0${timer}`
                    : `00:${timer}`}{" "}
                  seconds remaining
                </span>
              </div>
              {timer === 0 ? (
                <Button
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2 px-4 rounded-md"
                  onClick={handleSendOtp}
                >
                  Resend OTP
                </Button>
              ) : (
                <Button
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md"
                  onClick={handleVerifyOtp}
                >
                  Verify OTP
                </Button>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md mt-4"
            onClick={handleBackToLogin}
          >
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default VerifyUserEmail;
