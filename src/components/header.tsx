import { signOut } from 'firebase/auth';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaSearch, FaShoppingBag, FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { User } from '../types/types';


// creating one users object in which the user information is stored 
// const user = { _id : "",  role : ""};

interface PropsType {
    user : User | null;
}

const header = ({user}:PropsType) => {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const logoutHandler = async () => {
        try {
            await signOut(auth);
            toast.success("Sign Out Successfully");
            setIsOpen(false);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }catch(error){
            toast.error("Sign Out Fail");
        }
    };

  return (
    
    <nav className='header'>
        
        {/* now create links using react-router-dom method as follows.. */}
        <Link onClick={() => setIsOpen(false)} to={"/"}>HOME
        </Link>

        <Link onClick={() => setIsOpen(false)} to={"/search"}>
        <FaSearch/>
        </Link>

        <Link onClick={() => setIsOpen(false)} to={"/cart"}>
        <FaShoppingBag/>
        </Link>


{/* here showing if user is logged In then showing the profile buttons as follows. */}
        {
            user?._id? (
                <>
                <button onClick={() => setIsOpen((prev) => !prev)}><button/>
                    <FaUser/>
                </button>
                <dialog open = {isOpen}>
                    <div>
                        {
                            user.role == "admin" && (
                                <Link onClick={() => setIsOpen(false)}
                                 to="admin/dashboard">Admin</Link>
                            )
                        }

                        <Link onClick={() => setIsOpen(false)}
                        to="/orders">Orders</Link>

                        {/* creating button for sign out */}
                        <button onClick={logoutHandler}>
                            <FaSignOutAlt/>
                        </button>
                    </div>
                </dialog>
                </>
            ): <Link to={"/login"}>
                <FaSignInAlt/>
            </Link>
        }

    
    </nav>
  )
}

export default header
