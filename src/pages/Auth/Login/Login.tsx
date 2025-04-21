import LoginForm from "./Functions/LoginForm";

export default function Login() {
  return (
    <div className=" gap-y-3 flex justify-center items-center flex-col w-full h-screen">
      <div className="w-[90%] md:w-auto rounded-md gap-y-3 shadow-md p-4 flex justify-center items-center flex-col">
        <div className="ms-4 flex justify-center items-center w-32 h-32 rounded-full">
          <img src="/images/logo.png" alt="logo" />
        </div>
        <h1 className="font-bold text-2xl text-center">Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}
