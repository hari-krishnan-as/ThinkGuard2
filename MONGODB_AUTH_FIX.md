# MongoDB Authentication Fix

## 🚨 Issue Identified: Authentication Failed

The error `bad auth : authentication failed` means:
- Username or password is incorrect
- Database user doesn't exist
- User doesn't have proper permissions

## 🔧 Step-by-Step Fix:

### 1. Create New Database User in MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **"Database Access"** in left menu
3. Click **"Add New Database User"**
4. Fill in details:
   - **Username**: `thinkguardUser`
   - **Password**: `ThinkGuard2024!` (use a strong password)
   - **Confirm Password**: Same as above
5. **Database User Privileges**: 
   - Select **"Read and write to any database"**
6. Click **"Add User"**

### 2. Update Connection String

Replace your current MONGODB_URI with:

```bash
MONGODB_URI=mongodb+srv://thinkguardUser:ThinkGuard2024!@cluster0.8z6pv1p.mongodb.net/ThinkGuardDB?retryWrites=true&w=majority
```

### 3. Update Environment Variables

#### In Local Development (.env):
```bash
MONGODB_URI=mongodb+srv://thinkguardUser:ThinkGuard2024!@cluster0.8z6pv1p.mongodb.net/ThinkGuardDB?retryWrites=true&w=majority
```

#### In Render Dashboard:
1. Go to your backend service
2. Click **"Environment"** tab
3. Update `MONGODB_URI` with the new string above
4. Save changes

### 4. Test Connection

Run the test script:
```bash
cd server
node test-mongodb-auth.js
```

### 5. Alternative: Use Existing Admin User

If you prefer to use existing MongoDB user:

1. Go to **Database Access** in MongoDB Atlas
2. Find your existing user
3. Click **"Edit"** 
4. Verify password and permissions
5. Update connection string with correct credentials

## 🔍 What to Check:

### In MongoDB Atlas:
- ✅ User exists in **Database Access**
- ✅ Password is correct
- ✅ User has **Read and write to any database** permissions
- ✅ IP whitelist includes `0.0.0.0/0`

### Connection String Format:
```bash
mongodb+srv://username:password@cluster0.8z6pv1p.mongodb.net/ThinkGuardDB?retryWrites=true&w=majority
```

## 🚀 After Fixing:

1. **Restart server**: `npm run dev`
2. **Test connection**: Should see "✅ MongoDB connected successfully"
3. **Deploy to Render**: Update environment variables and redeploy
4. **Initialize database**: `node init-roles.js`

## 🎯 Most Common Solutions:

1. **Create new user** with strong password
2. **Grant proper permissions** (Read and write to any database)
3. **Use exact connection string** from MongoDB Atlas
4. **Update both local and Render** environment variables

**This will resolve the authentication failure!**
