# Portfolio App

A modular, professional portfolio website built with Node.js and Express, designed to showcase developer skills with CCW branding. This app dynamically renders content from JSON data, featuring a responsive design with gradients, hover effects, and a colorful UI. Deployed on Ubuntu EC2 with Nginx as a reverse proxy for optimal performance and security.

## 🧭 Deployment Architecture

### Why Nginx?
Nginx was chosen as the reverse proxy due to its high performance, low resource usage, and robust handling of static assets. It acts as a load balancer and security layer, protecting the Node.js application from direct exposure while efficiently serving requests.

### Interaction with Node.js App
- **Reverse Proxy Logic**: Nginx forwards incoming HTTP requests to the Node.js app running on `localhost:3000`. It handles static file serving (e.g., CSS, images) directly, reducing load on the Node.js process.
- **Port Mapping**: External traffic on port 80 (HTTP) is mapped to the internal Node.js server on port 3000.
- **Process Management**: PM2 manages the Node.js process, ensuring auto-restart on crashes and load balancing across CPU cores.

### Performance & Security Benefits
- **Performance**: Nginx's event-driven architecture handles thousands of concurrent connections efficiently, with built-in caching for static assets.
- **Security**: Acts as a buffer against direct attacks on the Node.js app, supports SSL/TLS termination, and allows rate limiting.
- **Scalability**: Easy to scale by adding more Node.js instances behind Nginx.

## 🚀 How to Deploy This App

Follow these steps to deploy the portfolio app on an Ubuntu EC2 instance:

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd nodeapp_portfolio_ngnix
   ```

2. **Install Node.js**:
   - Install Node.js v22.21.0 using the Node Version Manager (n):
     ```bash
     curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n
     bash n lts  # Installs latest LTS, or specify v22.21.0
     npm install -g n
     n v22.21.0
     ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run the App**:
   - For development: `npm start` (uses `node app.js`)
   - For production: Install PM2 and run:
     ```bash
     npm install -g pm2
     pm2 start app.js --name portfolio-app
     pm2 save
     pm2 startup
     ```

5. **Configure Nginx**:
   - Install Nginx: `sudo apt update && sudo apt install nginx`
   - Create a new site configuration in `/etc/nginx/sites-available/portfolio`:
     ```
     server {
         listen 80;
         server_name your-domain.com;

         location / {
             proxy_pass http://localhost:3000;
             proxy_http_version 1.1;
             proxy_set_header Upgrade $http_upgrade;
             proxy_set_header Connection 'upgrade';
             proxy_set_header Host $host;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             proxy_set_header X-Forwarded-Proto $scheme;
             proxy_cache_bypass $http_upgrade;
         }
     }
     ```
   - Enable the site: `sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/`
   - Remove default site: `sudo rm /etc/nginx/sites-enabled/default`

6. **Reload Nginx and Test**:
   ```bash
   sudo nginx -t  # Test configuration
   sudo systemctl reload nginx
   ```
   - Open your browser and navigate to the EC2 public IP or domain to verify the app is running.

## 🛠️ Actual EC2 Setup (Royal's Flow)

This section documents the exact steps taken during the initial deployment on an Ubuntu EC2 instance:

1. **Stopped Apache**: Confirmed Apache was inactive to avoid port conflicts.
2. **Installed Nginx**: Set up Nginx and configured `/etc/nginx/nginx.conf` with the reverse proxy settings for `localhost:3000`.
3. **Installed Node.js v22.21.0**: Used the `n` version manager to install the specific version.
4. **Used PM2 for Process Management**: Installed PM2 globally and started the app with `pm2 start app.js`.
5. **Transferred 1100+ Files**: Used zip compression and SCP for secure file transfer from local machine to EC2.
6. **Verified App**: Ran `npm audit` and confirmed 0 vulnerabilities; tested routes and content rendering.
7. **Reloaded Nginx**: Applied configuration changes and confirmed public access via browser.

## 🧱 What Can Be Deployed with Nginx?

Nginx serves as a versatile web server and reverse proxy, capable of handling various types of applications with optimal performance and security.

### 1. Static Websites
- **HTML, CSS, JS files**: Perfect for simple sites like portfolios, landing pages, or documentation.
- **Serving Method**: Files are served directly from the file system, typically from `/var/www/html` or a custom root folder.
- **Benefits**: Lightning-fast delivery with built-in caching and compression.

### 2. Dynamic Web Apps via Reverse Proxy
Nginx acts as a reverse proxy, forwarding requests to backend applications running on different ports. This architecture supports multiple tech stacks:

- **Node.js** (Express, Next.js)
- **Python** (Flask, Django)
- **PHP** (Laravel, WordPress)
- **Java** (Spring Boot)
- **Ruby** (Rails)

Each application runs on its designated port, and Nginx routes traffic using `proxy_pass` directives, providing load balancing, SSL termination, and security layers.

#### 🔧 How to Deploy Node.js with Nginx
- **Install Node.js**: Use version manager `n` to install v22.21.0: `n v22.21.0`
- **Run App**: Start your Node.js app on port 3000 using `node app.js` or PM2
- **Nginx Config**: Add `proxy_pass http://localhost:3000;` in server block

#### 🔧 How to Deploy Python (Flask) with Nginx
- **Install Python + Flask**: `pip install flask` after installing Python
- **Run App**: Launch Flask app on port 5000: `flask run --port=5000`
- **Nginx Config**: Configure `proxy_pass http://localhost:5000;` for routing

#### 🔧 How to Deploy PHP (Laravel) with Nginx
- **Install PHP + Composer**: `sudo apt install php composer`
- **Serve App**: Use PHP-FPM or Apache; point Nginx to Laravel's `public` folder
- **Nginx Config**: Set `root /path/to/laravel/public;` and configure PHP processing

#### 🔧 How to Deploy Java (Spring Boot) with Nginx
- **Build JAR**: Package your Spring Boot app: `mvn clean package`
- **Run App**: Execute JAR on port 8080: `java -jar app.jar --server.port=8080`
- **Nginx Config**: Proxy requests to `localhost:8080` with `proxy_pass`

#### 🔧 How to Deploy Ruby (Rails) with Nginx
- **Install Ruby + Rails**: Use RVM or rbenv: `gem install rails`
- **Run App**: Use Puma server on a custom port: `rails server -p 3001`
- **Nginx Config**: Forward traffic to the Rails app port via `proxy_pass`

## 📜 Royal's EC2 Deployment Flow

This section outlines the precise steps taken for deploying the portfolio app on Ubuntu EC2 with CCW branding:

- **Apache Disabled**: Stopped and confirmed Apache service was inactive to prevent port conflicts
- **Nginx Installed & Configured**: Set up Nginx via `/etc/nginx/nginx.conf` with reverse proxy settings targeting `localhost:3000`
- **Node.js v22.21.0 Installed**: Utilized the `n` version manager for precise Node.js installation
- **PM2 Process Management**: Employed PM2 for reliable app management, auto-restart, and load balancing
- **File Transfer**: Compressed 1100+ project files using zip and securely transferred via SCP
- **App Verification**: Conducted `npm audit` (0 vulnerabilities confirmed) and tested all routes/content rendering
- **Nginx Deployment**: Reloaded Nginx configuration and verified public access through browser testing

## 📦 Tech Stack

- **Node.js**: v22.21.0 - Server-side JavaScript runtime
- **Express**: Web framework for routing and middleware
- **EJS**: Templating engine for dynamic HTML rendering
- **Nginx**: Reverse proxy and web server
- **PM2**: Process manager for Node.js applications
- **EC2 Ubuntu**: Cloud hosting platform
- **SCP/zip**: Secure file transfer tools

## 📄 License & Credits

This project is licensed under the MIT License. Built with ❤️ for showcasing professional portfolios. Special thanks to the open-source community for Node.js, Express, and Nginx.

---

*For any issues or contributions, feel free to open an issue or pull request.*
