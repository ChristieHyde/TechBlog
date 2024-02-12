const Account = require('./Account');
const BlogPost = require('./BlogPost');
const Comment = require('./Comment');

// ASSOCIATIONS

Account.hasMany(BlogPost, {
    foreignKey: 'account_id',
    onDelete: 'CASCADE'
});

BlogPost.belongsTo(Account, {
    foreignKey: 'account_id'
});

Account.hasMany(Comment, {
    foreignKey: 'account_id',
    onDelete: 'CASCADE'
  });
  
Comment.belongsTo(Account, {
    foreignKey: 'account_id'
});

BlogPost.hasMany(Comment, {
    foreignKey: 'blog_id',
    onDelete: 'CASCADE'
  });
  
Comment.belongsTo(BlogPost, {
    foreignKey: 'blog_id'
});

module.exports = { Account, BlogPost, Comment };
