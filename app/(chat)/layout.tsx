const ChatLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto max-w-5xl min-h-screen flex flex-col">
      {children}
    </div>
  );
};

export default ChatLayout;
