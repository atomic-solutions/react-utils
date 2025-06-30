'use client';

import React, { useState, createContext, useContext } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Types
export interface IconProps {
  size: number;
  className?: string;
}

export interface SidebarLink {
  icon: (props: IconProps) => React.ReactNode;
  text: string;
  path: string;
  onClick?: () => void;
}

export interface SidebarProps {
  links: SidebarLink[];
  logo?: {
    src: string;
    alt: string;
    collapsed?: string; // Text to show when collapsed (e.g., "TI")
  };
  onLogout?: () => void;
  logoutText?: string;
  className?: string;
  defaultCollapsed?: boolean;
  // Render props for custom implementations
  renderLogo?: (collapsed: boolean) => React.ReactNode;
  renderLogout?: (collapsed: boolean) => React.ReactNode;
  // Custom link component
  linkComponent?: React.ComponentType<{
    href: string;
    children: React.ReactNode;
    className?: string;
  }>;
}

// Context for sidebar state
interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a Sidebar');
  }
  return context;
};

// Default Link component (can be overridden)
const DefaultLink: React.FC<{
  href: string;
  children: React.ReactNode;
  className?: string;
}> = ({ href, children, className }) => (
  <a href={href} className={className}>
    {children}
  </a>
);

// Hook to detect mobile
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

// Sidebar Toggle Button
const SidebarToggle: React.FC = () => {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <button
      onClick={() => setCollapsed(!collapsed)}
      className="w-9 h-9 flex items-center justify-center bg-white rounded-md shadow-md hover:bg-gray-50 transition-colors"
    >
      {collapsed ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
    </button>
  );
};

// Sidebar Link Component
const SidebarLinkComponent: React.FC<{
  link: SidebarLink;
  LinkComponent: React.ComponentType<{
    href: string;
    children: React.ReactNode;
    className?: string;
  }>;
  currentPath?: string;
}> = ({ link, LinkComponent, currentPath }) => {
  const { collapsed } = useSidebar();
  const isActive = currentPath === link.path;

  const handleClick = () => {
    if (link.onClick) {
      link.onClick();
    }
  };

  return (
    <li className="relative">
      {/* Active indicator */}
      <div className="absolute left-0 top-0 w-1 h-full overflow-hidden bg-transparent">
        <div
          className={`absolute inset-0 bg-blue-600 transition-transform ${
            isActive ? 'translate-y-0' : 'translate-y-full'
          }`}
        />
      </div>

      <LinkComponent
        href={link.path}
        className={`
          flex items-center h-12 px-4 mx-2 rounded-md font-medium transition-colors
          ${collapsed ? 'justify-center' : 'gap-3'}
          ${
            isActive
              ? 'bg-blue-50 text-blue-600'
              : 'text-gray-700 hover:bg-gray-100'
          }
        `}
      >
        <div onClick={handleClick} className="flex items-center gap-3 w-full">
          {link.icon({ 
            size: 20, 
            className: isActive ? 'text-blue-600' : 'text-gray-700' 
          })}
          {!collapsed && <span>{link.text}</span>}
        </div>
      </LinkComponent>
    </li>
  );
};

// Default Logo Component
const DefaultLogo: React.FC<{
  logo: SidebarProps['logo'];
  collapsed: boolean;
}> = ({ logo, collapsed }) => {
  if (!logo) return null;

  if (collapsed && logo.collapsed) {
    return (
      <div className="flex items-center justify-center h-16 text-xl font-bold text-gray-800">
        {logo.collapsed}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-16 p-4">
      <img
        src={logo.src}
        alt={logo.alt}
        className="max-h-full max-w-full object-contain"
      />
    </div>
  );
};

// Default Logout Component
const DefaultLogout: React.FC<{
  onLogout?: () => void;
  logoutText?: string;
  collapsed: boolean;
}> = ({ onLogout, logoutText = 'Logout', collapsed }) => {
  const [loading, setLoading] = useState(false);

  if (!onLogout) return null;

  const handleLogout = async () => {
    setLoading(true);
    try {
      await onLogout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`
        flex items-center h-12 mx-2 mb-4 px-4 rounded-md font-medium
        text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50
        ${collapsed ? 'justify-center' : 'gap-3'}
      `}
    >
      <div className="w-5 h-5 flex items-center justify-center">
        {loading ? (
          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        )}
      </div>
      {!collapsed && <span>{logoutText}</span>}
    </button>
  );
};

// Main Sidebar Component
export const Sidebar: React.FC<SidebarProps> = ({
  links,
  logo,
  onLogout,
  logoutText,
  className = '',
  defaultCollapsed = false,
  renderLogo,
  renderLogout,
  linkComponent: LinkComponent = DefaultLink,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const isMobile = useIsMobile();
  const [currentPath, setCurrentPath] = useState('');

  // Update current path (for web environments)
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const contextValue: SidebarContextType = {
    collapsed,
    setCollapsed,
    isMobile,
  };

  return (
    <SidebarContext.Provider value={contextValue}>
      <aside
        className={`
          flex flex-col h-screen bg-white border-r-2 shadow-lg transition-all duration-300
          ${collapsed ? 'w-16' : 'w-64'}
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex flex-col border-b border-gray-200">
          {/* Logo */}
          {renderLogo ? (
            renderLogo(collapsed)
          ) : (
            <DefaultLogo logo={logo} collapsed={collapsed} />
          )}

          {/* Toggle Button */}
          <div className="flex justify-end p-2">
            <SidebarToggle />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 justify-between py-4">
          {/* Navigation Links */}
          <nav className="flex-1">
            <ul className="space-y-1">
              {links.map((link) => (
                <SidebarLinkComponent
                  key={link.path}
                  link={link}
                  LinkComponent={LinkComponent}
                  currentPath={currentPath}
                />
              ))}
            </ul>
          </nav>

          {/* Logout */}
          {renderLogout ? (
            renderLogout(collapsed)
          ) : (
            <DefaultLogout
              onLogout={onLogout}
              logoutText={logoutText}
              collapsed={collapsed}
            />
          )}
        </div>
      </aside>
    </SidebarContext.Provider>
  );
};

export default Sidebar;
