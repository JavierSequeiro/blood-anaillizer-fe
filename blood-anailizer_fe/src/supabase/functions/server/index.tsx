import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Create Supabase client for admin operations
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Create Supabase client for user auth checks
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_ANON_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-69acea83/health", (c) => {
  return c.json({ status: "ok" });
});

// Auth Routes
app.post("/make-server-69acea83/auth/signup", async (c) => {
  try {
    const { email, password, name, userType, language } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    // Validate userType and language
    const validUserTypes = ["Patient", "Doctor"];
    const validLanguages = ["en", "es", "ch", "fr"];
    
    if (userType && !validUserTypes.includes(userType)) {
      return c.json({ error: "Invalid user type" }, 400);
    }
    
    if (language && !validLanguages.includes(language)) {
      return c.json({ error: "Invalid language code" }, 400);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        userType: userType || "Patient",
        language: language || "en"
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true,
    });

    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store user preferences in KV store for easy access
    await kv.set(`user_preferences:${data.user.id}`, {
      userId: data.user.id,
      userType: userType || "Patient",
      language: language || "en",
      name: name
    });

    return c.json({ 
      success: true, 
      userId: data.user.id,
      message: "Account created successfully" 
    });
  } catch (error) {
    console.log(`Server error during signup: ${error}`);
    return c.json({ error: "Failed to create account" }, 500);
  }
});

app.post("/make-server-69acea83/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: "Email and password are required" }, 400);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log(`Error signing in user: ${error.message}`);
      return c.json({ error: "Invalid email or password" }, 401);
    }

    return c.json({
      accessToken: data.session.access_token,
      userId: data.user.id,
      email: data.user.email,
    });
  } catch (error) {
    console.log(`Server error during signin: ${error}`);
    return c.json({ error: "Failed to sign in" }, 500);
  }
});

// Blood Test Routes
app.post("/make-server-69acea83/blood-tests", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized - No access token provided" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      console.log(`Authorization error while creating blood test: ${authError?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const testData = await c.req.json();
    const testId = crypto.randomUUID();
    
    const bloodTest = {
      id: testId,
      userId: user.id,
      biomarkers: testData.biomarkers,
      report: testData.report,
      uploadDate: new Date().toISOString(),
      fileName: testData.fileName,
    };

    await kv.set(`blood_test:${user.id}:${testId}`, bloodTest);

    return c.json({ success: true, testId, test: bloodTest });
  } catch (error) {
    console.log(`Server error while creating blood test: ${error}`);
    return c.json({ error: "Failed to save blood test" }, 500);
  }
});

app.get("/make-server-69acea83/blood-tests", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized - No access token provided" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      console.log(`Authorization error while fetching blood tests: ${authError?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const tests = await kv.getByPrefix(`blood_test:${user.id}:`);
    
    // Sort by upload date (newest first)
    const sortedTests = tests.sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );

    return c.json({ tests: sortedTests });
  } catch (error) {
    console.log(`Server error while fetching blood tests: ${error}`);
    return c.json({ error: "Failed to fetch blood tests" }, 500);
  }
});

app.get("/make-server-69acea83/blood-tests/:testId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized - No access token provided" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      console.log(`Authorization error while fetching blood test: ${authError?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const testId = c.req.param('testId');
    const test = await kv.get(`blood_test:${user.id}:${testId}`);

    if (!test) {
      return c.json({ error: "Test not found" }, 404);
    }

    return c.json({ test });
  } catch (error) {
    console.log(`Server error while fetching blood test: ${error}`);
    return c.json({ error: "Failed to fetch blood test" }, 500);
  }
});

// Get user preferences
app.get("/make-server-69acea83/user/preferences", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized - No access token provided" }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user?.id) {
      console.log(`Authorization error while fetching user preferences: ${authError?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Try to get preferences from KV store first
    let preferences = await kv.get(`user_preferences:${user.id}`);
    
    // If not in KV store, get from user metadata
    if (!preferences) {
      preferences = {
        userId: user.id,
        userType: user.user_metadata?.userType || "Patient",
        language: user.user_metadata?.language || "en",
        name: user.user_metadata?.name || user.email
      };
      
      // Store in KV for future requests
      await kv.set(`user_preferences:${user.id}`, preferences);
    }

    return c.json({ preferences });
  } catch (error) {
    console.log(`Server error while fetching user preferences: ${error}`);
    return c.json({ error: "Failed to fetch user preferences" }, 500);
  }
});

Deno.serve(app.fetch);