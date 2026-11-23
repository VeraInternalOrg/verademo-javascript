const dbconnector = require('../utils/dbconnector.js');

const MAX_QUERY_LENGTH = 50;
const MAX_RESULTS = 25;

// Escape LIKE wildcards so user input is matched literally
function escapeLike(value) {
    return value.replace(/[\\%_]/g, '\\$&');
}

async function showFindFriends(req, res) {
    const username = req.session.username;
    if (username == null) {
        return res.redirect("login?target=friends");
    }

    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    res.locals["q"] = q;

    if (q === '') {
        res.locals["results"] = [];
        return res.render("friends");
    }
    if (q.length > MAX_QUERY_LENGTH) {
        res.locals["error"] = "Search must be " + MAX_QUERY_LENGTH + " characters or fewer.";
        res.locals["results"] = [];
        return res.render("friends");
    }

    const sql = "SELECT users.username, users.blab_name,"
            + " SUM(IF(listeners.listener = ?, 1, 0)) AS listening"
            + " FROM users LEFT JOIN listeners ON users.username = listeners.blabber"
            + " WHERE (users.username LIKE ? OR users.blab_name LIKE ? OR users.real_name LIKE ?)"
            + " AND users.username NOT IN ('admin', 'admin-totp', ?)"
            + " GROUP BY users.username, users.blab_name"
            + " ORDER BY users.blab_name ASC LIMIT ?;";
    const pattern = "%" + escapeLike(q) + "%";

    try {
        const rows = await dbconnector.query(sql, [username, pattern, pattern, pattern, username, MAX_RESULTS]);
        res.locals["results"] = rows.map(row => ({
            username: row.username,
            blabName: row.blab_name,
            isListening: Number(row.listening) > 0,
        }));
    } catch (err) {
        console.error(err);
        res.locals["error"] = "Something went wrong while searching. Please try again.";
        res.locals["results"] = [];
    }

    return res.render("friends");
}

module.exports = {
    showFindFriends,
};
