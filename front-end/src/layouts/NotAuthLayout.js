import { motion } from 'framer-motion'
import React from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'

export default function NotAuthLayout({children}) {
    return (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>

            <Header/>
            {children}
            <Footer/>
        </motion.div>
    )
}
