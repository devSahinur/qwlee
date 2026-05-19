 
import './App.css'
import Forgotpassword from './dashboard/auth/Forgotpassword'
import OtpVerify from './dashboard/auth/OtpVerify'
import Signin from './dashboard/auth/Signin'

function App() {
 
  return (
    <>
        <div>
          <h1 className='text-blue-400 text-2xl text-center py-5'>marketplace dashborad</h1> 
          <Signin></Signin>
          <Forgotpassword></Forgotpassword>
          <OtpVerify></OtpVerify>
        </div>
    </>
  )
}

export default App
