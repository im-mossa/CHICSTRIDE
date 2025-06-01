// src/db/BasketDB.js
import { getCookie, setCookie } from "../utils/helpers";

export default class BasketDB {
    // Load basket array from cookie
    static load() {
        const str = getCookie("basket");
        if (!str) return [];
        try {
            const arr = JSON.parse(str);
            return Array.isArray(arr) ? arr.filter(Boolean) : [];
        } catch {
            return [];
        }
    }

    // Save basket array to cookie
    static save(items) {
        setCookie("basket", JSON.stringify(items), 30);
    }

    // Add item to basket (or increment existing)
    static addToBasket(product, size, color) {
        const items = this.load();
        const existing = items.find(
            (itm) =>
                itm.id === product.id &&
                itm.sizeId === size.id &&
                itm.colorId === color.id
        );
        if (existing) {
            existing.qty++;
        } else {
            items.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                qty: 1,
                sizeId: size.id,
                sizeTitle: size.title,
                colorId: color.id,
                colorTitle: color.title,
                colorHex: color.hexValue,
            });
        }
        this.save(items);
    }

    static increaseQTY(idx) {
        const items = this.load();
        if (items[idx]) {
            items[idx].qty++;
            this.save(items);
        }
        return items[idx]?.qty || 0;
    }

    static decreaseQTY(idx) {
        const items = this.load();
        if (items[idx]) {
            items[idx].qty--;
            if (items[idx].qty <= 0) {
                items.splice(idx, 1);
            }
            this.save(items);
            return items[idx]?.qty || 0;
        }
        return 0;
    }
}
