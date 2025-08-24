import React from 'react';
import About from '../../Components/About';
import TitleSubTitle from '../../Components/TitleSubTitle';
import { Users, Heart, Target, Award, CheckCircle, Globe } from 'lucide-react';
import Image from 'next/image';
import SectionBanner from '@/app/Components/reusable/SectionBanner';

const AboutUsPage = () => {
    const stats = [
        { icon: Users, number: "10K+", label: "People Helped" },
        { icon: Heart, number: "500+", label: "Successful Campaigns" },
        { icon: Target, number: "$2M+", label: "Funds Raised" },
        { icon: Award, number: "50+", label: "Partners" }
    ];

    const values = [
        {
            icon: Heart,
            title: "Compassion",
            description: "We believe in showing genuine care and empathy for those in need, treating every individual with dignity and respect."
        },
        {
            icon: CheckCircle,
            title: "Transparency",
            description: "We maintain complete transparency in all our operations, ensuring donors and beneficiaries can trust our processes."
        },
        {
            icon: Globe,
            title: "Community",
            description: "We foster strong community bonds, bringing people together to create positive change in society."
        },
        {
            icon: Target,
            title: "Impact",
            description: "We focus on creating measurable, lasting impact through our campaigns and initiatives."
        }
    ];

    const team = [
        {
            name: "Sarah Johnson",
            role: "Founder & CEO",
            image: "/people.svg",
            description: "Passionate about creating positive change through community-driven initiatives."
        },
        {
            name: "Michael Chen",
            role: "Operations Director",
            image: "/people.svg",
            description: "Expert in managing large-scale humanitarian projects and volunteer coordination."
        },
        {
            name: "Emily Rodriguez",
            role: "Community Outreach",
            image: "/people.svg",
            description: "Dedicated to building strong relationships with communities and partners."
        }
    ];

    return (
        <div className="min-h-screen">
            <SectionBanner title={"About Us"} />
            {/* Existing About Component */}
            <div className="py-16 bg-gray-50">
                <About />
            </div>

            {/* Statistics Section */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <TitleSubTitle
                            subTitle="Our Impact"
                            title="Making a Difference Together"
                        />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <stat.icon className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-3xl font-bold text-[#071c35] mb-2">{stat.number}</h3>
                                <p className="text-gray-600">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <TitleSubTitle
                            subTitle="Our Values"
                            title="What Drives Us Forward"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                    <value.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#071c35] mb-3">{value.title}</h3>
                                <p className="text-gray-600 text-sm">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mission & Vision Section */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <TitleSubTitle
                                subTitle="Our Mission"
                                title="Connecting Hearts, Building Hope"
                            />
                            <p className="text-gray-600 mt-6 leading-relaxed">
                                Our mission is to create a world where no one faces their challenges alone. 
                                We believe in the power of community and collective action to bring about 
                                meaningful change. Through our platform, we connect generous donors with 
                                worthy causes, dedicated volunteers with opportunities to serve, and 
                                communities with the resources they need to thrive.
                            </p>
                            <p className="text-gray-600 mt-4 leading-relaxed">
                                We are committed to transparency, accountability, and ensuring that every 
                                contribution makes a real difference in someone's life.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-primary/10 to-blue-600/10 p-8 rounded-lg">
                            <h3 className="text-2xl font-semibold text-[#071c35] mb-4">Our Vision</h3>
                            <p className="text-gray-600 leading-relaxed">
                                To become the leading platform for community-driven social impact, 
                                where millions of people come together to create positive change 
                                and build stronger, more compassionate communities worldwide.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <TitleSubTitle
                            subTitle="Our Team"
                            title="Meet the People Behind Rise Together"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                                <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        width={48}
                                        height={48}
                                        className="rounded-full"
                                    />
                                </div>
                                <h3 className="text-xl font-semibold text-[#071c35] mb-2">{member.name}</h3>
                                <p className="text-primary font-medium mb-3">{member.role}</p>
                                <p className="text-gray-600 text-sm">{member.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="py-16 bg-primary text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Join Us in Making a Difference</h2>
                    <p className="text-xl mb-8 text-blue-100">
                        Whether you want to donate, volunteer, or start a campaign, 
                        there's a place for you in our community.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                            Start a Campaign
                        </button>
                        <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary transition-colors">
                            Become a Volunteer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;