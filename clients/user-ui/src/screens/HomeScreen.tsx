import HomeIntroduction from "@/views/Root/HomeIntroduction";
import Header from "../components/Layout/Header";

const HomeScreen = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HomeIntroduction />
    </div>
  );
};

export default HomeScreen;
