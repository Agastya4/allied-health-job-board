import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center">
      {/* Light mode logo */}
      <Image
        src="/logo-light.png"
        alt="Allied Health Jobs Logo"
        width={180}
        height={40}
        className="block dark:hidden"
        priority
      />
      {/* Dark mode logo */}
      <Image
        src="/logo-dark.png"
        alt="Allied Health Jobs Logo"
        width={180}
        height={40}
        className="hidden dark:block"
        priority
      />
    </div>
  );
}
