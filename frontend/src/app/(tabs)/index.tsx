import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import ListUserShowChat from "../../components/ListUserShowChat";
import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import { Image } from "expo-image";
import { getBehaviorFromToken } from "../utils/secureStore";

const Home = () => {
  const windowWidth = Dimensions.get("window").width;
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["48%"], []);

  const selectedId = useSelector((state: RootState) => state.user.selectedId);
  const [selected, setSelected] = useState<"nam" | "nữ" | "cả hai">("cả hai");
  const [genderFilter, setGenderFilter] = useState<"nam" | "nữ" | "cả hai">(
    "cả hai"
  );
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePresentModal = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSelect = useCallback((key: "nam" | "nữ" | "cả hai") => {
    setSelected(key);
  }, []);

  const handleComplete = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
    setGenderFilter(selected);
    setRefreshKey((prevKey) => prevKey + 1); // Tăng refreshKey để kích hoạt việc refresh
  }, [selected]);

  const renderBackDrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} />,
    []
  );
  const renderGenderOption = useCallback(
    (
      type: "nam" | "nữ" | "cả hai",
      label: string,
      icon: any,
      selectedIcon: any
    ) => (
      <View style={styles.genderOption}>
        <TouchableOpacity onPress={() => handleSelect(type)}>
          <Image
            source={selected === type ? selectedIcon : icon}
            style={styles.genderIcon}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
          <Text
            style={[
              styles.genderText,
              selected === type && styles.selectedGenderText,
            ]}
          >
            {label}
          </Text>
        </TouchableOpacity>
      </View>
    ),
    [selected, handleSelect]
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <BottomSheetModalProvider>
          <View style={styles.header}>
            <TouchableOpacity onPress={handlePresentModal}>
              <Image
                source={require("../../../assets/img/filter.png")}
                style={styles.filterIcon}
                contentFit="contain"
                cachePolicy="memory-disk"
              />
            </TouchableOpacity>
            <Text style={styles.title}>CTU Social</Text>
          </View>
          <ListUserShowChat
            key={refreshKey}
            genderFilter={genderFilter}
            selectedId={selectedId}
          />
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={0}
            snapPoints={snapPoints}
            backgroundStyle={styles.bottomSheetBackground}
            backdropComponent={renderBackDrop}
          >
            <Text style={styles.modalTitle}>Giới tính</Text>
            <View style={styles.genderOptionsContainer}>
              {renderGenderOption(
                "nam",
                "nam",
                require("../../../assets/img/male-gender.png"),
                require("../../../assets/img/male-gender-purpel.png")
              )}
              {renderGenderOption(
                "nữ",
                "nữ",
                require("../../../assets/img/female-gray.png"),
                require("../../../assets/img/female-purpel.png")
              )}
              {renderGenderOption(
                "cả hai",
                "Cả hai",
                require("../../../assets/img/gender-gray.png"),
                require("../../../assets/img/gender-purpel.png")
              )}
            </View>
            <TouchableOpacity
              onPress={handleComplete}
              activeOpacity={0.7}
              style={styles.completeButtonContainer}
            >
              <View style={styles.completeButton}>
                <Text style={styles.completeButtonText}>Hoàn Thành</Text>
              </View>
            </TouchableOpacity>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 45 : 0,
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 100,
    position: "relative",
  },
  filterIcon: {
    width: 25,
    height: 25,
    marginLeft: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#333",
  },
  bottomSheetBackground: {
    backgroundColor: "white",
  },
  modalTitle: {
    color: "gray",
    paddingLeft: 15,
  },
  genderOptionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  genderOption: {
    width: Dimensions.get("window").width / 3 - 20,
    height: 130,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    gap: 10,
  },
  genderIcon: {
    width: 40,
    height: 40,
  },
  genderText: {
    color: "black",
    textAlign: "center",
    marginTop: 5,
  },
  selectedGenderText: {
    color: "#AC8AAD",
  },
  completeButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
  completeButton: {
    width: 250,
    height: 60,
    backgroundColor: "#AC8AAD",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 27,
  },
  completeButtonText: {
    fontWeight: "bold",
    color: "white",
    fontSize: 17,
  },
});
