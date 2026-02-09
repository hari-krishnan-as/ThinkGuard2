# MongoDB Cluster Fix Required

## 🚨 Issue Found: Invalid Cluster Name

Your connection string has:
```
mongodb+srv://thinkguardUser:tvhXf66KGaVIUVgw@cluster.mongodb.net/ThinkGuardDB
```

The problem: `cluster.mongodb.net` is a placeholder, not your actual cluster.

## 🔧 How to Fix:

### Step 1: Get Your Actual Cluster Name
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **"Clusters"** in the left menu
3. Look at your cluster name (it's usually something like `cluster0`, `mycluster`, etc.)
4. Click **"Connect"** on your cluster
5. Copy the connection string from there

### Step 2: Update Your Connection String
Replace `cluster` with your actual cluster name:

**Example:**
```
# Wrong (placeholder)
mongodb+srv://thinkguardUser:tvhXf66KGaVIUVgw@cluster.mongodb.net/ThinkGuardDB

# Correct (example)
mongodb+srv://thinkguardUser:tvhXf66KGaVIUVgw@cluster0.mongodb.net/ThinkGuardDB
```

### Step 3: Update Render Environment Variable
1. Go to your Render backend service
2. Update `MONGODB_URI` with the correct cluster name
3. Redeploy your backend

## 📋 What Your Connection String Should Look Like:
```
mongodb+srv://thinkguardUser:tvhXf66KGaVIUVgw@YOUR_ACTUAL_CLUSTER_NAME.mongodb.net/ThinkGuardDB?retryWrites=true&w=majority
```

## 🎯 Quick Fix:
1. Login to MongoDB Atlas
2. Go to your cluster
3. Click "Connect"
4. Copy the connection string
5. Replace the environment variable in Render

## ✅ After Fixing:
- Redeploy your backend service
- Test the connection
- Initialize database if needed

**This will fix the DNS resolution error!**
