import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="text-center">
      <h1>Login</h1>
      <Link to="/dashboard" className="border px-10">
        Click here to go to dasboard
      </Link>
    </div>
  );
}
