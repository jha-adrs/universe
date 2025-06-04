import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

const Layout = async ({ children, params }) => {
  const { slug } = params;
  const session = await getAuthSession();

  // Get the user data for the layout
  const user = await db.user.findFirst({
    where: {
      username: slug
    },
    select: {
      id: true,
      username: true,
      name: true,
      image: true,
      joinedDate: true,
      karma: true
    }
  });

  if (!user) {
    return notFound();
  }
  
  return (
    <div className="max-w-7xl mx-auto h-full w-full py-6">
      {children}
    </div>
  );
};

export default Layout;

