"use client";

// import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface User {
  email: string;
}

type ResetPasswordProps = {
  params: { token: string }; // ✅ no Promise here
};

function ResetPassword({ params }: ResetPasswordProps) {
  const token = params.token; // ✅ token comes directly from params

  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [confirmShowPassword, setConfirmShowPassword] = useState(false);
  //const { data: session, status: sessionStatus } = useSession();


  // ✅ Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch("/api/verifytoken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (res.status === 400) {
          setError("Invalid token or token has expired");
          setVerified(true);
          return;
        }

        if (res.status === 200) {
          const userData = await res.json(); // should contain at least { email }
          setUser(userData);
          setError("");
          setVerified(true);
        }
      } catch (err) {
        console.error(err);
        setError("Error verifying token, please try again.");
        setVerified(true);
      }
    };

    if (token) {
      verifyToken();
    }
  }, [token]);

//   // ✅ If already logged in, send them away
//   useEffect(() => {
//     if (sessionStatus === "authenticated") {
//       router.replace("/homepage");
//     }
//   }, [sessionStatus, router]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const confirmTogglePasswordVisibility = () => {
    setConfirmShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const password = (form[0] as HTMLInputElement).value;
    const confirmPassword = (form[1] as HTMLInputElement).value;

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("/api/resetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          email: user?.email, // ✅ this will be returned by /api/verifytoken
          token,              // (optional) we can also send the token to double-check on backend
        }),
      });

      if (res.status === 400) {
        setError("Something went wrong, please try again.");
        return;
      }

      if (res.status === 200) {
        toast("Password Reset Successful!",{
          description: "You can now log in with your new password.",
          className: "bg-customServicesColor text-white",
        });
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      setError("Error, please try again.");
    }
  };

  return (
    // sessionStatus !== "authenticated" && (
      <div className="background">
        <div className="w-full h-screen flex justify-center items-center">
          <div className="md:w-[19vw] md:h-[20vw] h-[46vh] w-[82vw] bg-buttonColor pb-[4vw] rounded-3xl">
            <div className="flex flex-col md:mt-[0.9vw] mt-[5vw] md:ml-[2vw] ml-[4vw] space-y-[3vh]">
              <h1 className="md:text-[1.5vw] text-[5vw]">Reset Password</h1>

              <form onSubmit={handleSubmit}>
                <div className="md:space-y-[1.5vw] space-y-[3vh]">
                  {/* New Password */}
                  <div>
                    <h1 className="mb-[1vh] md:text-[0.9vw]">
                      New Password
                    </h1>
                    <div className="flex relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="bg-transparent h-[7vh] w-[75vw] md:h-[5.5vh] md:px-[1.5vw] px-[4vw] md:w-[15vw] placeholder-customTextColor rounded-full md:text-[0.8vw] border border-customTextColor"
                        placeholder="Password..."
                        required
                      />
                      <div
                        className="absolute md:right-[3vw] right-[7vw] top-[50%] transform -translate-y-[50%] cursor-pointer bg-buttonColor pl-[0.5vw]"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <AiOutlineEyeInvisible className="bg-buttonColor md:w-[1.3vw] md:h-[1.3vw] w-[6vw] h-[6vh]" />
                        ) : (
                          <AiOutlineEye className="bg-buttonColor md:w-[1.3vw] md:h-[1.3vw] w-[6vw] h-[6vh]" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <h1 className="mb-[1vh]">Confirm New Password</h1>
                    <div className="flex relative">
                      <input
                        type={confirmShowPassword ? "text" : "password"}
                        className="bg-transparent h-[7vh] w-[75vw] md:h-[5.5vh] md:px-[1.5vw] px-[4vw] md:w-[15vw] placeholder-customTextColor rounded-full md:text-[0.8vw] border border-customTextColor"
                        placeholder="Confirm password..."
                        required
                      />
                      <div
                        className="absolute md:right-[3vw] right-[7vw] top-[50%] transform -translate-y-[50%] cursor-pointer bg-buttonColor pl-[0.5vw]"
                        onClick={confirmTogglePasswordVisibility}
                      >
                        {confirmShowPassword ? (
                          <AiOutlineEyeInvisible className="bg-buttonColor md:w-[1.3vw] md:h-[1.3vw] w-[6vw] h-[6vh]" />
                        ) : (
                          <AiOutlineEye className="bg-buttonColor md:w-[1.3vw] md:h-[1.3vw] w-[6vw] h-[6vh]" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-start ml-[-1vw]">
                    <Link
                      href="/"
                      className="bg-transparent rounded-full md:px-[1.5vw] px-[5vw] md:py-[0.5vw] py-[2vw] md:text-[0.9vw] md:m-[0.2vw] m-[2vw] hover:bg-transparent"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="bg-customColorCard rounded-full md:px-[1.5vw] px-[5vw] md:py-[0.5vw] py-[2vw] md:text-[0.9vw] md:m-[0.2vw] m-[2vw] hover:bg-white/90 hover:text-black active:bg-white/90 active:scale-95"
                    >
                      Reset Password
                    </button>
                  </div>

                  {/* Error */}
                  <p className="text-red-600 md:text-[0.9vw] text-[4vw] mt-[0.5vw]">
                    {error}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
 // );
}

export default ResetPassword;
