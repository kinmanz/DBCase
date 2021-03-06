package services;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/*
SINGLETON CLASS (I know that it's quite strange Singleton)
to get instance - getInstance()
* */
public class PropertyService {

    //    manual testing
    public static void main(String[] args) {
        final String dir = System.getProperty("user.dir");
        System.out.println("current dir = " + dir);
        PropertyService propertyService = new PropertyService();
        System.out.println(propertyService.getProperties());
    }

    private static PropertyService instance = null;

    private PropertyService() {
        properties = new Properties();

        try (InputStream input = getClass().getClassLoader().getResourceAsStream(pathToFile)) {
            properties.load(input);

            System.out.println("Get Properties: ");
            System.out.println(properties.stringPropertyNames());

        } catch (IOException ex) {
            System.out.println("Problem with property file !!!");
            ex.printStackTrace();
        }
    }

//    initialization (for multithreading) in advance
//    it help avoid redundant coding
    static {
        instance = new PropertyService();
    }
    public static PropertyService getInstance() {
        return instance;
    }

    static private Properties properties;
    static private final String pathToFile = "dbConnector.properties";


    public Properties getProperties() {
        return properties;
    }

    public String getProperty(String propertyName) {
        return properties.getProperty(propertyName);
    }
}