import { useState } from "react";
import { Eye, EyeOff, Loader } from "lucide-react";
import { toast } from "react-toastify";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../../components/firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
export default function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   const payload = {
  //     email: email,
  //     password: password,
  //   };
  //   try {
  //     console.log("Payload:", payload);
  //     await signInWithEmailAndPassword(auth, email, password);
  //     console.log("User logged in succesfully!");
  //     toast.success("User logged in successfully");
  //     navigate("/dashboard");
  //     setIsLoading(false);
  //   } catch (error: any) {
  //     console.log(error.message);
  //     toast.error(error.message, {
  //       position: "top-right",
  //     });
  //     setIsLoading(false);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      email: email,
      password: password,
    };

    try {
      console.log("Payload:", payload);

      // Step 1: Try to sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("Firebase Auth successful for:", user.email);

      // Step 2: Check if user exists in Users collection and has correct role
      const usersRef = collection(db, "Users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Sign out if no user record found
        await auth.signOut();
        throw new Error("No user record found. Please contact administrator.");
      }

      // Step 3: Get user data and verify role
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      console.log("User found:", userData);

      // Step 4: Check if user is an admin
      if (userData.role !== "admin") {
        // Sign out if not admin
        await auth.signOut();
        throw new Error("Access denied. Admin privileges required.");
      }

      // Step 5: Success - user is authenticated and has admin role
      console.log("Admin user logged in successfully!");
      toast.success("User logged in successfully");

      // Store user info for the session
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: userDoc.id,
          uid: user.uid,
          email: userData.email,
          role: userData.role,
          isVerified: userData.isVerified,
        })
      );

      navigate("/dashboard");
      setIsLoading(false);
    } catch (error: any) {
      console.log("Login error:", error.message);

      // Handle specific Firebase Auth errors
      let errorMessage = error.message;
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      }

      toast.error(errorMessage, {
        position: "top-right",
      });
      setIsLoading(false);
    }
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="mt-8 w-full md:w-md mb-6 mx-auto"
      >
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            name="floating_email"
            id="floating_email"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-secondary focus:outline-none focus:ring-0 focus:border-secondary peer"
            placeholder=" "
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <label
            htmlFor="floating_email"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-secondary peer-focus:dark:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type={passwordVisible ? "text" : "password"}
            name="floating_password"
            id="floating_password"
            className="block py-2.5 px-0 pr-10 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-secondary focus:outline-none focus:ring-0 focus:border-secondary peer"
            placeholder=" "
            required
            onChange={(e: any) => setPassword(e.target.value)}
          />
          <label
            htmlFor="floating_password"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-secondary peer-focus:dark:text-secondary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Password
          </label>
          <div
            className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer pr-2"
            onClick={() => setPasswordVisible(!passwordVisible)}
          >
            {passwordVisible ? <Eye size={20} /> : <EyeOff size={20} />}
          </div>
        </div>
        <button
          type="submit"
          className="mt-8 m-auto cursor-pointer w-full text-white bg-secondary/80 hover:bg-secondary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  py-2.5 text-center"
        >
          {isLoading ? (
            <Loader size={24} className="mx-auto animate-spin" />
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </>
  );
}
