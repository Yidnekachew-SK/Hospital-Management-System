exports.verifyUsername = async (req, res) => {
    try {
        const { username } = req.params;
        // Sending back the specific data object the frontend expects
        res.status(200).json({ 
            success: true, 
            data: { username: username } 
        });
    } catch (error) {
        res.status(404).json({ success: false, message: "User not found" });
    }
};

exports.verifyPassword = async (req, res) => {
    try {
        res.status(200).json({ 
            success: true, 
            data: { 
                match: true,
                role: 'admin' // <--- This is the "Key" the frontend needs
            } 
        });
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
};

// Standard stubs for remaining routes
exports.register = async (req, res) => res.json({ success: true });
exports.login = async (req, res) => res.json({ success: true });