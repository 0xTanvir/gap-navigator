import AboutHeroSection from "@/components/about/about-hero-section";
import AboutOurMissionSection from "@/components/about/about-our-mission-section";
import AboutTeam from "@/components/about/about-team";
import AboutTimelineSection from "@/components/about/about-timeline-section";

const IndexPage = () => {
    return (
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
            {/*Hero Section*/}
            <AboutHeroSection/>

            {/* Timeline section */}
            <AboutTimelineSection/>

            {/*Mission Section*/}
            <AboutOurMissionSection/>

            {/* Team section */}
            <AboutTeam/>
        </section>
    );
};

export default IndexPage;
