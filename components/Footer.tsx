import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone, Youtube, Video, Globe as WebIcon } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const getSocialIcon = (platform: string) => {
  switch (platform) {
    case 'Instagram': return Instagram;
    case 'Facebook': return Facebook;
    case 'Twitter': return Twitter;
    case 'Youtube': return Youtube;
    case 'TikTok': return Video;
    case 'Website': return WebIcon;
    case 'Email': return Mail;
    case 'Phone': return Phone;
    default: return WebIcon;
  }
};

const Footer: React.FC = () => {
  const { content, socialLinks } = useData();
  
  return (
    <footer id="footer" className="bg-heritage-dark text-white pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-6 h-6 text-heritage-gold" />
              <span className="font-display font-bold text-xl tracking-wider">
                {content.branding.siteName}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              The Cultural Service of Sawahlunto City. Dedicated to preserving the Ombilin Coal Mining Heritage and promoting our rich cultural traditions to the world.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(link => {
                  const Icon = getSocialIcon(link.platform);
                  return (
                    <a key={link.id} href={link.url} target="_blank" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-heritage-gold transition-colors">
                      <Icon className="w-4 h-4" />
                    </a>
                  );
               })}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-6 text-heritage-gold">Contact Us</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-1 shrink-0" />
                <span>{content.contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4" />
                <span>{content.contact.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>{content.contact.email}</span>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-6 text-heritage-gold">Quick Links</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Visitor Information</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Virtual Tours</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Events Calendar</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accommodation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Culinary Guide</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-6 text-heritage-gold">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe to get the latest updates on events and heritage news.</p>
            <div className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-white/5 border border-white/10 rounded px-4 py-3 text-sm focus:outline-none focus:border-heritage-gold text-white"
              />
              <button className="bg-heritage-gold text-white font-bold text-sm uppercase tracking-widest py-3 rounded hover:bg-yellow-600 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} {content.branding.siteName} Cultural Service. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;