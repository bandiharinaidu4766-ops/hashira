import java.math.BigInteger;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.Arrays;
import java.util.stream.Collectors;

// Class to represent a single root from the JSON
class Root {
    public String base;
    public String value;
    
    public Root(String base, String value) {
        this.base = base;
        this.value = value;
    }
}

// Class to hold n and k from the JSON
class Keys {
    public int n;
    public int k;

    public Keys(int n, int k) {
        this.n = n;
        this.k = k;
    }
}

// Class to map the entire JSON structure
class TestCase {
    public Keys keys;
    public Map<String, Root> roots;
    
    public TestCase(Keys keys, Map<String, Root> roots) {
        this.keys = keys;
        this.roots = roots;
    }
}

public class Main {

    // Function to convert a number from a given base to BigInteger
    private static BigInteger toBigInteger(String value, String baseStr) {
        int base = Integer.parseInt(baseStr);
        return new BigInteger(value, base);
    }

    // Function to find the secret 'c' using Lagrange Interpolation
    private static BigInteger findSecret(TestCase testCase) {
        int k = testCase.keys.k;
        
        // Get the first k root keys in numerical order
        List<String> rootKeys = testCase.roots.keySet().stream()
                .sorted((a, b) -> Integer.compare(Integer.parseInt(a), Integer.parseInt(b)))
                .limit(k)
                .collect(Collectors.toList());

        BigInteger result = BigInteger.ZERO;

        for (int i = 0; i < k; i++) {
            String x_i_str = rootKeys.get(i);
            Root root_i = testCase.roots.get(x_i_str);
            BigInteger x_i = new BigInteger(x_i_str);
            BigInteger y_i = toBigInteger(root_i.value, root_i.base);

            BigInteger term = y_i;
            for (int j = 0; j < k; j++) {
                if (i != j) {
                    String x_j_str = rootKeys.get(j);
                    BigInteger x_j = new BigInteger(x_j_str);

                    // Lagrange interpolation formula: (0 - x_j) / (x_i - x_j)
                    BigInteger numerator = BigInteger.ZERO.subtract(x_j);
                    BigInteger denominator = x_i.subtract(x_j);
                    
                    term = term.multiply(numerator).divide(denominator);
                }
            }
            result = result.add(term);
        }
        return result;
    }

    public static void main(String[] args) {
        // Test Case 1
        Map<String, Root> roots1 = new HashMap<>();
        roots1.put("1", new Root("10", "4"));
        roots1.put("2", new Root("2", "111"));
        roots1.put("3", new Root("10", "12"));
        roots1.put("6", new Root("4", "213"));
        TestCase testCase1 = new TestCase(new Keys(4, 3), roots1);
        System.out.println("Secret for Test Case 1: " + findSecret(testCase1));

        // Test Case 2
        Map<String, Root> roots2 = new HashMap<>();
        roots2.put("1", new Root("6", "13444211440455345511"));
        roots2.put("2", new Root("15", "aed7015a346d635"));
        roots2.put("3", new Root("15", "6aeeb69631c227c"));
        roots2.put("4", new Root("16", "e1b5e05623d881f"));
        roots2.put("5", new Root("8", "316034514573652620673"));
        roots2.put("6", new Root("3", "2122212201122002221120200210011020220200"));
        roots2.put("7", new Root("3", "20120221122211000100210021102001201112121"));
        roots2.put("8", new Root("6", "20220554335330240002224253"));
        roots2.put("9", new Root("12", "45153788322a1255483"));
        roots2.put("10", new Root("7", "1101613130313526312514143"));
        TestCase testCase2 = new TestCase(new Keys(10, 7), roots2);
        System.out.println("Secret for Test Case 2: " + findSecret(testCase2));
    }
}
