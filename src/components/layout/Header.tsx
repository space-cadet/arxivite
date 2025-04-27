import { ModeToggle } from "@/components/mode-toggle"

const Header = () => {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 justify-end">
        <ModeToggle />
      </div>
    </div>
  );
};

export default Header;