import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <>
      <br /> <br /> 
      <div className="flex justify-center items-center">
        <SignIn />
      </div>
    </>
  );
}