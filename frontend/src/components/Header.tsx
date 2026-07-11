type HeaderProps = {
  title: string;
};

function Header({ title }: HeaderProps) {
  return (
    <header>
      <h1>{title}</h1>
      <p>Your Personal AI Assistant</p>
    </header>
  );
}

export default Header;
