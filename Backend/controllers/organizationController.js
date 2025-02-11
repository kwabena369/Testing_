const Organization = require('../models/organization');
const User = require('../models/userModel'); // Ensure User model is imported

exports.createOrganization = async (req, res) => {
  try {
    const { name, description, userId } = req.body;
    const organization = await Organization.create({ name, description, userId });
    res.status(201).json(organization);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error creating organization' });
  }
};

exports.getOrganizations = async (req, res) => {
  try {
    const userId = req.query.userId; // Get userId from query parameters
    const options = {
      include: [
        { association: 'Reviews' },
        {
          model: User,
          as: 'Creator',
          attributes: ['id', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    };

    // Add userId filter if provided
    if (userId) {
      options.where = { userId };
    }

    const organizations = await Organization.findAll(options);
    res.status(200).json(organizations);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error fetching organizations' });
  }
};

exports.getOrganization = async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.id, {
      include: 'Reviews',
    });
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    res.status(200).json(organization);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error fetching organization' });
  }
};
