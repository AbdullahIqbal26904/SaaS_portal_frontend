import { IoHomeOutline } from "react-icons/io5";
import { FaUsers, FaBuilding, FaRegFile, FaChartLine, FaCubes, FaGlobe, FaPlus, FaUserPlus } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { setActiveSection } from "@/redux/slices/urlslice";
import { openModal } from "@/redux/slices/urlslice";

function Leftbar() {
    const { openleftbar, activeSection } = useSelector(state => state.ui);
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();
    
    let buttons = [
        { id: 'dashboard', name: "Dashboard", icon: <IoHomeOutline /> },
        { id: 'departments', name: "Departments", icon: <FaBuilding /> },
        { id: 'users', name: "Users", icon: <FaUsers /> },
        { id: 'services', name: "Service Packages", icon: <FaCubes /> },
        { id: 'subscriptions', name: "Subscriptions", icon: <FaRegFile /> },
        { id: 'analytics', name: "Analytics", icon: <FaChartLine /> },
    ];

    // Only show resellers to root admins
    if (user && user.is_root_admin) {
        buttons.splice(2, 0, { id: 'resellers', name: "Resellers", icon: <FaGlobe /> });
    }

    function handleNavigation(buttonId) {
        dispatch(setActiveSection(buttonId));
        
        // In a real app, we might navigate to different URLs
        // but for this example, we'll stay within the admin dashboard
        if (buttonId === 'dashboard') {
            router.push('/rootAdminDashboard');
        }
    }

    function handleCreateNew() {
        dispatch(openModal({ type: 'createMenu', data: {} }));
    }

    return (
        <div className={`fixed flex items-center justify-center flex-col h-full bg-white border-r-2 ${openleftbar ? 'w-1/6' : 'w-16'}`}>
            {/* Logo */}
            <div className="absolute left-3 top-3 h-12 flex items-center">
                <img className={`${openleftbar ? 'h-10 w-10 mr-2' : "h-8 w-8"}`} src="/images/5074297.png" alt="Logo" />
                {openleftbar && <span className="font-bold text-lg">SaaS Portal</span>}
            </div>
            
            {/* Create New Button */}
            <button 
                onClick={handleCreateNew}
                className={`absolute top-20 bg-blue-600 hover:bg-blue-700 font-medium text-white rounded-md flex items-center justify-center gap-2
                    ${openleftbar ? 'w-[90%] h-[40px]' : "h-10 w-10"}`}>
                <FaPlus /> 
                {openleftbar && <span className="font-semibold">Create new</span>}
            </button>

            <hr className="w-full absolute top-[135px] border-gray-300" />

            {/* Sidebar Buttons */}
            <div className="w-full absolute top-[150px]">
                {buttons.map((button) => (
                    <button
                        key={button.id}
                        className={`w-full h-12 flex items-center justify-start pl-5 hover:bg-gray-100 gap-3
                            ${activeSection === button.id ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600' : ''}`}
                        onClick={() => handleNavigation(button.id)}
                    >
                        {button.icon}
                        {openleftbar && <span className="font-medium">{button.name}</span>}
                    </button>
                ))}
            </div>
            
            <hr className="w-full absolute bottom-16 border-gray-300" />
            <div className="w-full absolute bottom-4">
                <button
                    onClick={() => dispatch(setActiveSection('settings'))}
                    className={`w-full h-12 flex items-center justify-start pl-5 hover:bg-gray-100 gap-3
                        ${activeSection === 'settings' ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600' : ''}`}
                >
                    <IoSettingsSharp />
                    {openleftbar && <span className="font-medium">Settings</span>}
                </button>
            </div>
        </div>
    );
}

export default Leftbar;
