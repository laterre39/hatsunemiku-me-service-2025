import {
  Code,
  ExternalLink,
  Heart,
  Mail,
  Users,
  User,
  AudioLines,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { FaFacebook, FaInstagram, FaXTwitter, FaGithub } from "react-icons/fa6";
import { SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiVercel } from "react-icons/si";
import React from 'react';
import Image from 'next/image';
import { specialThanksList } from "@/data/specialThanksList";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'About',
  description: 'HatsuneMiku.me 프로젝트와 팀 39AREA, 그리고 기술 스택을 소개합니다.',
  openGraph: {
    title: 'About | HATSUNEMIKU.ME',
    description: 'HatsuneMiku.me 프로젝트와 팀 39AREA, 그리고 기술 스택을 소개합니다.',
    url: 'https://hatsunemiku.me/about',
  },
};

const SectionCard = ({ icon, title, children }: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode
}) => (
    <div className="rounded-xl border border-white/10 bg-white/5 p-8 shadow-lg backdrop-blur-sm">
      <div className="flex items-center mb-6 gap-3 font-bold text-2xl text-white">
        {icon}
        <h2>{title}</h2>
      </div>
      <div className="text-slate-300 leading-relaxed">
        {children}
      </div>
    </div>
);

const TechIcon = ({ icon, name }: { icon: React.ReactNode; name: string }) => (
    <div
        className="group flex flex-col items-center gap-2 text-center transition-transform duration-300 hover:-translate-y-1">
      <div className="flex h-16 w-16 items-center justify-center">
        {icon}
      </div>
      <span className="text-sm text-slate-400">{name}</span>
    </div>
);

const DefaultAvatar = () => (
    <div
        className="w-24 h-24 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center">
      <User size={40} className="text-slate-400"/>
    </div>
);

const getSocialIcon = (type: string) => {
  const iconProps = {
    size: 22,
    className: 'text-slate-400 group-hover:text-cyan-400 transition-colors'
  };
  switch (type) {
    case 'instagram':
      return <FaInstagram {...iconProps} />;
    case 'x':
      return <FaXTwitter {...iconProps} />;
    case 'facebook':
      return <FaFacebook {...iconProps} />;
    case 'github':
      return <FaGithub {...iconProps} />;
    case 'link':
      return <LinkIcon {...iconProps} />;
    default:
      return <ExternalLink {...iconProps} />;
  }
};

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'MIKUMIKU',
      role: 'Project Lead & Developer',
      avatarUrl: '/about/miku_profile.png',
      description: '하츠네 미쿠를 사랑하는 마음으로 프로젝트를 시작했습니다. 모두가 즐길 수 있는 공간이 되길 바랍니다.',
      socials: [
        { type: 'link', url: 'https://hatsunemiku.me/' },
      ]
    },
    {
      name: 'JOWON',
      role: 'Developer',
      avatarUrl: '/about/miku_profile.png',
      description: '미쿠의 목소리가 더 많은 사람들에게 닿을 수 있도록, 안정적인 서비스를 위해 노력하겠습니다.',
      socials: [
        { type: 'link', url: 'https://hatsunemiku.me/' },
      ]
    },
    {
      name: '치즈나베',
      role: 'Developer',
      avatarUrl: '/about/miku_profile.png',
      description: '보컬로이드 씬의 즐거움을 함께 나누고 싶습니다. 기술로써 그 마음에 기여합니다.',
      socials: [
        { type: 'link', url: 'https://hatsunemiku.me/' },
      ]
    },
  ];

  const techStack = [
    { name: 'Next.js', icon: <SiNextdotjs size={40} className="text-white"/> },
    { name: 'React', icon: <SiReact size={40} className="text-cyan-400"/> },
    { name: 'TypeScript', icon: <SiTypescript size={40} className="text-blue-400"/> },
    { name: 'Tailwind CSS', icon: <SiTailwindcss size={40} className="text-teal-400"/> },
    { name: 'Vercel', icon: <SiVercel size={40} className="text-white"/> },
  ];

  return (
      <main className="mx-auto max-w-4xl py-12 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            About <span className="text-cyan-400">HatsuneMiku.me</span>
          </h1>
          <p className="text-lg text-slate-400">
           이곳은 하츠네 미쿠와 보컬로이드 문화를 사랑하는 모든 팬들을 위한 공간입니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <SectionCard icon={<Heart size={24} className="text-red-400"/>} title="프로젝트 소개">
            <p>
              이 프로젝트는 하츠네 미쿠와 보컬로이드 음악을 사랑하는 팬들을 위한 비영리 팬 프로젝트입니다.
              흩어져 있는 다양한 정보를 한곳에 모아 한국 팬들이 보다 쉽고 깊이 있게 보컬로이드 문화를 즐길 수 있도록 돕는 것을 목표로 하고 있습니다.
              앞으로의 활동 많은 기대 부탁드립니다.
            </p>
          </SectionCard>

          <SectionCard icon={<Code size={24} className="text-green-400"/>} title="기술 스택">
            <p className="text-center text-slate-400 mb-8">
              ✨ 사용자 친화적인 인터페이스와 안정적인 정보 제공을 위해, 다음 기술들을 사용했습니다.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              {techStack.map(tech => <TechIcon key={tech.name} name={tech.name} icon={tech.icon}/>)}
            </div>
          </SectionCard>

          <SectionCard icon={<AudioLines size={24} className="text-cyan-400"/>} title="팀 소개">
            <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
              <div
                  className="flex-shrink-0 w-32 h-32 rounded-full border border-white/10 flex items-center justify-center">
                <Image src="/about/39area_logo.png" alt="Team 39Area Logo" width={128} height={128}
                       className="rounded-full object-cover"/>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">39AREA</h3>
                <p>
                  저희는 하츠네 미쿠와 보컬로이드를 사랑하는 마음으로 뭉친 팬들로 이루어진 팀입니다. 각자의 전문 분야에서 즐겁게 기여하며, 팬들에게 더 나은 경험을 제공하기
                  위해 노력하고 있습니다.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map(member => (
                  <div key={member.name}
                       className="group rounded-xl border border-white/10 bg-white/5 p-6 text-center transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/10 hover:-translate-y-1">
                    <div className="relative w-24 h-24 mx-auto">
                      {member.avatarUrl ? (
                          <Image src={member.avatarUrl} alt={member.name} width={96} height={96}
                                 className="rounded-full object-cover border-2 border-white/10"/>
                      ) : (
                          <DefaultAvatar/>
                      )}
                    </div>
                    <h4 className="mt-4 text-lg font-bold text-white">{member.name}</h4>
                    <p className="text-sm text-cyan-400">{member.role}</p>
                    <p className="mt-4 text-sm text-slate-300 min-h-[40px]">{member.description}</p>
                    <div className="mt-4 flex justify-center gap-2">
                      {member.socials.map(social => (
                          <a key={social.type} href={social.url} target="_blank"
                             rel="noopener noreferrer" className="p-1">
                            {getSocialIcon(social.type)}
                          </a>
                      ))}
                    </div>
                  </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard icon={<Users size={24} className="text-yellow-400"/>} title="기여 및 피드백">
            <p>
              이 프로젝트는 오픈소스로 운영되며, 여러분의 참여를 언제나 환영합니다. 기능 제안, 버그 리포트, 디자인 개선 등 어떤 형태의 기여든 소중히
              생각하겠습니다.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <a href="mailto:contact@hatsunemiku.me"
                 className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 ring-1 ring-inset ring-cyan-500/20 transition-colors hover:bg-cyan-500/20">
                <Mail size={16}/>
                피드백 보내기
              </a>
            </div>
          </SectionCard>

          <SectionCard icon={<Sparkles size={24} className="text-purple-400" />} title="Special Thanks">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {specialThanksList.map(({name, contribution, links}) => (
                  <div key={name}
                       className="group relative flex flex-col items-center text-center rounded-xl border border-white/10 bg-white/5 p-6 shadow-lg transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/10 hover:-translate-y-1">
                    <h3 className="font-semibold text-white text-lg">{name}</h3>
                    <p className="text-sm text-slate-400 mt-1">{contribution}</p>
                    <div className="flex items-center gap-2 mt-4">
                      {links?.map((link) => (
                          <a key={link.url} href={link.url} target="_blank"
                             rel="noopener noreferrer"
                             className="p-2 rounded-full transition-colors">
                            {getSocialIcon(link.type)}
                          </a>
                      ))}
                    </div>
                  </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </main>
  );
}
