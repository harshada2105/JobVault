import { NavLink } from 'react-router-dom';

const links = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/applications', label: 'Applications' },
  { path: '/companies', label: 'Companies' },
  { path: '/interviews', label: 'Interviews' },
  { path: '/contacts', label: 'Contacts' },
  { path: '/documents', label: 'Documents' },
  { path: '/search', label: 'Search' },
  { path: '/statistics', label: 'Statistics' },
  { path: '/profile', label: 'Profile' }
];

function Sidebar() {
  return (
    <aside className="sidebar p-3">
      <div className="text-white fw-bold fs-4 mb-4">JobVault</div>
      <nav className="nav flex-column">
        {links.map((link) => (
          <NavLink key={link.path} to={link.path} className="nav-link">
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
