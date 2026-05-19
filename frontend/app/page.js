"use client";
import PrimaryLayout from "@/components/Layout/PrimaryLayout";
import HeroQwlee from "@/components/Home/HeroQwlee/HeroQwlee";
import MarketplaceStats from "@/components/Home/HeroSection/MarketplaceStats";
import RecentlyViewedGigs from "@/components/Home/RecentlyViewed/RecentlyViewedGigs";
import JoinCNNCTR from "@/components/Home/JoinCNNCTR/JoinCNNCTR";
import MostPopularCategories from "@/components/Home/MostPopularCategories/MostPopularCategories";
import MostPopularFreelancers from "@/components/Home/MostPopularFreelancers/MostPopularFreelancers";
import Testimonials from "@/components/Home/Testimonials/Testimonials";
import TheLatestNewsAndBlog from "@/components/Home/TheLatestNewsAndBlog/TheLatestNewsAndBlog";
import WhyChooseUs from "@/components/Home/WhyChooseUs/WhyChooseUs";

const Home = () => {
  return (
    <PrimaryLayout>
      <main>
        <HeroQwlee />
        <MarketplaceStats />
        {/* Renders nothing for first-time visitors with empty localStorage */}
        <RecentlyViewedGigs />
        <MostPopularCategories />
        <MostPopularFreelancers />
        <WhyChooseUs />
        <Testimonials />
        <JoinCNNCTR />
        <TheLatestNewsAndBlog />
      </main>
    </PrimaryLayout>
  );
};

export default Home;
