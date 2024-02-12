const router = require('express').Router();
const { Account } = require('../../models');
const { Op } = require('sequelize');

router.post('/signup', async (req, res) => {
    try {
        // Check for duplicate emails in database
        const duplicateAccountCheck = await Account.findOne({
            where: {
                [Op.or]: [
                    {
                        name: { [Op.eq]: req.body.name }
                    },
                    {
                        email: { [Op.eq]: req.body.email }
                    },
                ]
            }
        });
        if (duplicateAccountCheck) {
            res
                .status(400)
                .json({ message: 'An account with this email address already exists' });
            return;
        }

        // If no conflicts, create account
        const accountData = await Account.create(req.body);

        req.session.save(() => {
            req.session.account_id = accountData.id;
            req.session.logged_in = true;

        res.status(200).json(accountData);
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/login', async (req, res) => {
    try {
        const accountData = await Account.findOne({
            where: {
                [Op.or]: [
                    {
                        name: { [Op.eq]: req.body.nameOrEmail }
                    },
                    {
                        email: { [Op.eq]: req.body.nameOrEmail }
                    },
                ]
            }
        });
        if (!accountData) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        const validPassword = await accountData.checkPassword(req.body.password);

        if (!validPassword) {
            res
                .status(400)
                .json({ message: 'Incorrect email or password, please try again' });
            return;
        }

        req.session.save(() => {
            req.session.account_id = accountData.id;
            req.session.logged_in = true;
      
            res.json({ account: accountData, message: 'Login successful' });
        });

    } catch (err) {
        res.status(400).json(err);
    }
});

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;
