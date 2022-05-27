import { motion } from 'framer-motion'
import React from 'react'

export default function Spinner() {
    return (
        <div className="spinner">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ repeat: 100, duration: 1 }}
            >
              <i class="bi bi-arrow-repeat"></i>
            </motion.div>
        </div>
    )
}
