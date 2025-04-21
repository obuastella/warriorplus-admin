import SecuritySettings from "./components/SecuritySettings";
import UpdateProfile from "./components/UpdateProfile";

export default function Settings() {
  return (
    <div className="px-2 h-full">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="w-full md:w-[90%]">
        <UpdateProfile />
        <SecuritySettings />
      </div>
    </div>
  );
}
