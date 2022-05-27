import { motion } from 'framer-motion'
import React from 'react'
import AuthHeader from '../components/AuthHeader'
import Footer from '../components/Footer'

export default function AuthLayout({children}) {
    return (
        
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <AuthHeader/>
            {children}
            <Footer/>
        </motion.div>
    )
}
