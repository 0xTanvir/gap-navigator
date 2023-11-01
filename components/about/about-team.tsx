import React from 'react';
import TeamCard from "@/components/about/team-card";

const AboutTeam = () => {
    return (
        <section className="pt-20 pb-10 lg:pt-[120px] lg:pb-20">
            <div className="container mx-auto">
                <div className="-mx-4 flex flex-wrap">
                    <div className="w-full px-4">
                        <div className="mx-auto mb-[60px] max-w-[510px] text-center">
                            <span className="text-primary mb-2 block text-lg font-semibold">
                                Our Team
                            </span>
                            <h2 className="text-dark mb-4 text-3xl font-bold sm:text-4xl md:text-[40px]">
                                Meet Our Team
                            </h2>
                            <p className="text-body-color text-base">
                                There are many variations of passages of Lorem Ipsum available
                                but the majority have suffered alteration in some form.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="-mx-4 flex flex-wrap justify-center">
                    <TeamCard
                        name="Adveen Desuza"
                        profession="UI Designer"
                        imageSrc="https://cdn.tailgrids.com/1.0/assets/images/team/team-02/image-01.png"
                        facebookLink="/#"
                        twitterLink="/#"
                        instagramLink="/#"
                    />
                    <TeamCard
                        name="Jezmin uniya"
                        profession="Product Designer"
                        imageSrc="https://cdn.tailgrids.com/1.0/assets/images/team/team-02/image-02.png"
                        facebookLink="/#"
                        twitterLink="/#"
                        instagramLink="/#"
                    />
                    <TeamCard
                        name="Andrieo Gloree"
                        profession="App Developer"
                        imageSrc="https://cdn.tailgrids.com/1.0/assets/images/team/team-02/image-03.png"
                        facebookLink="/#"
                        twitterLink="/#"
                        instagramLink="/#"
                    />
                    <TeamCard
                        name="Jackie Sanders"
                        profession="Content Writer"
                        imageSrc="https://cdn.tailgrids.com/1.0/assets/images/team/team-02/image-04.png"
                        facebookLink="/#"
                        twitterLink="/#"
                        instagramLink="/#"
                    />
                </div>
            </div>
        </section>
    );
};

export default AboutTeam;