import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>About PawGrade</Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>What PawGrade Does</Text>
        <Text style={styles.body}>
          PawGrade helps pet owners make informed decisions about what they feed their dogs. Scan a
          barcode or photograph an ingredient label to get an instant safety analysis powered by AI
          and peer-reviewed veterinary research.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>How Scores Work</Text>
        <Text style={styles.body}>
          Each ingredient is evaluated based on published research from the ASPCA, WHO, NIH, FDA,
          and veterinary nutrition literature. Ingredients are flagged as harmful, concerning, or
          safe. A final score (0–100) reflects the overall quality of the formula.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Disclaimer</Text>
        <Text style={styles.body}>
          PawGrade is for informational and educational purposes only. Scores are not veterinary
          advice. Always consult your veterinarian before changing your pet's diet. We are not
          affiliated with any pet food manufacturer.
        </Text>
      </View>

      <Link href="/" dismissTo style={styles.link}>
        <Text style={styles.linkText}>← Back to Scanner</Text>
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 48,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1a1a2e',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a2e',
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
  },
  link: {
    marginTop: 16,
    alignSelf: 'center',
  },
  linkText: {
    color: '#2563eb',
    fontSize: 15,
    fontWeight: '600',
  },
});
