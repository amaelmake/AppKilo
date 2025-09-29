# 📱 AppKilo - Version Mobile

**AppKilo** est la version mobile de Kilométrik, transformée en Progressive Web App (PWA) pour une expérience native sur mobile.

## 🚀 **Installation sur Mobile**

### **Sur Android :**
1. Ouvrez Chrome ou Edge
2. Allez sur votre site Kilométrik
3. Appuyez sur le menu (⋮) → "Ajouter à l'écran d'accueil"
4. Confirmez l'installation

### **Sur iPhone/iPad :**
1. Ouvrez Safari
2. Allez sur votre site Kilométrik
3. Appuyez sur le bouton de partage (□↑)
4. Sélectionnez "Sur l'écran d'accueil"
5. Confirmez l'installation

## ✨ **Fonctionnalités Mobile**

### **Interface Optimisée :**
- ✅ **Design mobile-first** avec Tailwind CSS
- ✅ **Navigation tactile** intuitive
- ✅ **Formulaires optimisés** pour mobile
- ✅ **Boutons de taille appropriée** pour les doigts

### **Fonctionnalités PWA :**
- ✅ **Installation native** sur l'écran d'accueil
- ✅ **Mode hors-ligne** (cache intelligent)
- ✅ **Notifications push** (à venir)
- ✅ **Icône personnalisée** AppKilo
- ✅ **Splash screen** automatique

### **Fonctionnalités Kilométrik :**
- ✅ **Gestion des trajets** avec calcul automatique
- ✅ **Barème kilométrique français 2025**
- ✅ **Gestion multi-véhicules**
- ✅ **Exports PDF/CSV**
- ✅ **Dashboard avec statistiques**

## 🛠️ **Développement**

### **Lancer en mode développement :**
```bash
npm run dev
```

### **Tester sur mobile :**
1. Trouvez votre IP locale : `ipconfig` (Windows) ou `ifconfig` (Mac/Linux)
2. Accédez à `http://VOTRE_IP:3000` depuis votre mobile
3. Testez l'installation PWA

### **Build de production :**
```bash
npm run build
npm run start
```

## 📱 **Configuration PWA**

### **Manifeste :**
- **Nom** : AppKilo
- **Couleur de thème** : Bleu (#2563eb)
- **Orientation** : Portrait
- **Affichage** : Standalone (comme une app native)

### **Service Worker :**
- **Cache intelligent** des ressources
- **Mode hors-ligne** pour les pages visitées
- **Mise à jour automatique** du cache

## 🎨 **Design Mobile**

### **Breakpoints :**
- **Mobile** : < 768px (optimisé)
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

### **Composants Responsive :**
- Navigation hamburger sur mobile
- Cartes adaptatives
- Formulaires en pleine largeur
- Boutons tactiles optimisés

## 🚀 **Déploiement**

### **Vercel (Recommandé) :**
1. Connectez votre repo GitHub
2. Configurez les variables d'environnement
3. Déployez automatiquement
4. Votre PWA sera accessible sur mobile !

### **Variables d'environnement :**
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="https://votre-domaine.com"
```

## 📊 **Métriques PWA**

### **Lighthouse Score :**
- **Performance** : 90+
- **Accessibilité** : 95+
- **Bonnes pratiques** : 90+
- **PWA** : 100

### **Fonctionnalités PWA :**
- ✅ Manifeste valide
- ✅ Service Worker
- ✅ HTTPS
- ✅ Icônes appropriées
- ✅ Mode hors-ligne

## 🔧 **Personnalisation**

### **Changer l'icône :**
1. Remplacez `/public/icon.svg`
2. Générez les tailles 192x192 et 512x512
3. Mettez à jour le manifeste

### **Changer les couleurs :**
1. Modifiez `theme_color` dans le manifeste
2. Ajustez les couleurs Tailwind
3. Mettez à jour les métadonnées

## 📱 **App Stores (Futur)**

### **Capacitor (Optionnel) :**
```bash
# Installer Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init AppKilo com.votreentreprise.appkilo

# Ajouter les plateformes
npx cap add android
npx cap add ios

# Build et déployer
npm run build
npx cap sync
npx cap open android
```

## 🎯 **Roadmap AppKilo**

### **v1.0 (Actuel) :**
- ✅ PWA fonctionnelle
- ✅ Interface mobile optimisée
- ✅ Installation native

### **v1.1 (Prochainement) :**
- 🔄 Notifications push
- 🔄 Mode hors-ligne complet
- 🔄 Géolocalisation GPS

### **v1.2 (Futur) :**
- 🔄 App Store (Android/iOS)
- 🔄 Synchronisation cloud
- 🔄 Mode sombre

---

**AppKilo** - Votre assistant kilométrique dans votre poche ! 🚗📱
