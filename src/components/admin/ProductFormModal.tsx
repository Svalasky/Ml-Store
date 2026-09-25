"use client";

import React, { useState, useEffect } from "react";
import { Product, ProductSkin, ProductHero, SkinType, AccountStatus } from "@/types/product";
import { saveProduct } from "@/services/productService";
import { uploadAccountScreenshot } from "@/services/storageService";
import { X, Upload, Plus, Trash2, Loader2, Sparkles, Trophy, Gamepad2, Shield } from "lucide-react";

interface ProductFormModalProps {
  product?: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (saved: Product) => void;
}

const RANKS = [
  "Mythical Immortal",
  "Mythical Glory",
  "Mythical Honor",
  "Mythic",
  "Legend",
  "Epic",
  "Grandmaster",
  "Master",
];

const SKIN_TYPES: SkinType[] = [
  "collector",
  "legend",
  "epic",
  "special",
  "elite",
  "season",
  "other",
];

export function ProductFormModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}: ProductFormModalProps) {
  const isEdit = Boolean(product?.id);

  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [originalPrice, setOriginalPrice] = useState(
    product?.original_price?.toString() || ""
  );
  const [status, setStatus] = useState<AccountStatus>(product?.status || "available");
  const [featured, setFeatured] = useState(Boolean(product?.featured));

  // Specs
  const [level, setLevel] = useState(product?.level?.toString() || "50");
  const [rank, setRank] = useState(product?.rank || "Mythic");
  const [server, setServer] = useState(product?.server || "1001");
  const [battleId, setBattleId] = useState(product?.battle_id || "");
  const [winRate, setWinRate] = useState(product?.win_rate?.toString() || "60");
  const [totalMatches, setTotalMatches] = useState(
    product?.total_matches?.toString() || "2000"
  );

  // Content Counts
  const [heroCount, setHeroCount] = useState(product?.hero_count?.toString() || "80");
  const [skinCount, setSkinCount] = useState(product?.skin_count?.toString() || "100");
  const [collectorCount, setCollectorCount] = useState(
    product?.collector_count?.toString() || "2"
  );
  const [legendCount, setLegendCount] = useState(
    product?.legend_count?.toString() || "1"
  );
  const [epicCount, setEpicCount] = useState(product?.epic_count?.toString() || "30");
  const [specialCount, setSpecialCount] = useState(
    product?.special_count?.toString() || "20"
  );
  const [eliteCount, setEliteCount] = useState(product?.elite_count?.toString() || "25");
  const [seasonCount, setSeasonCount] = useState(
    product?.season_skin_count?.toString() || "15"
  );

  const [description, setDescription] = useState(product?.description || "");
  const [terms, setTerms] = useState(
    product?.terms ||
      "Garansi Anti Hack-Back Seumur Hidup. Akun Monsep (Moonton Sepaket) dengan Gmail khusus yang diberikan langsung kepada pembeli."
  );

  // Images
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [images, setImages] = useState<string[]>(
    product?.images?.map((img) => img.image_url) ||
      (product?.primary_image ? [product.primary_image] : [])
  );

  // Skins list
  const [skins, setSkins] = useState<ProductSkin[]>(product?.skins || []);
  const [newSkinHero, setNewSkinHero] = useState("");
  const [newSkinName, setNewSkinName] = useState("");
  const [newSkinType, setNewSkinType] = useState<SkinType>("collector");

  // Heroes list
  const [heroes, setHeroes] = useState<ProductHero[]>(product?.heroes || []);
  const [newHeroName, setNewHeroName] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const origOverflow = document.body.style.overflow;
      const origHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.classList.add("modal-open");
      return () => {
        document.body.style.overflow = origOverflow;
        document.documentElement.style.overflow = origHtmlOverflow;
        document.body.classList.remove("modal-open");
      };
    }
  }, [isOpen]);

  // Sync state when editing product changes
  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setSlug(product.slug || "");
      setPrice(product.price?.toString() || "");
      setOriginalPrice(product.original_price?.toString() || "");
      setStatus(product.status || "available");
      setFeatured(Boolean(product.featured));
      setLevel(product.level?.toString() || "50");
      setRank(product.rank || "Mythic");
      setServer(product.server || "1001");
      setBattleId(product.battle_id || "");
      setWinRate(product.win_rate?.toString() || "60");
      setTotalMatches(product.total_matches?.toString() || "2000");
      setHeroCount(product.hero_count?.toString() || "80");
      setSkinCount(product.skin_count?.toString() || "100");
      setCollectorCount(product.collector_count?.toString() || "0");
      setLegendCount(product.legend_count?.toString() || "0");
      setEpicCount(product.epic_count?.toString() || "0");
      setSpecialCount(product.special_count?.toString() || "0");
      setEliteCount(product.elite_count?.toString() || "0");
      setSeasonCount(product.season_skin_count?.toString() || "0");
      setDescription(product.description || "");
      setTerms(product.terms || "Garansi Anti Hack-Back Seumur Hidup.");
      setImages(
        product.images?.map((img) => img.image_url) ||
          (product.primary_image ? [product.primary_image] : [])
      );
      setSkins(product.skins || []);
      setHeroes(product.heroes || []);
    } else {
      setName("");
      setSlug("");
      setPrice("");
      setOriginalPrice("");
      setStatus("available");
      setFeatured(false);
      setLevel("50");
      setRank("Mythic");
      setServer("1001");
      setBattleId("");
      setWinRate("60");
      setTotalMatches("2000");
      setHeroCount("80");
      setSkinCount("100");
      setCollectorCount("2");
      setLegendCount("1");
      setEpicCount("30");
      setSpecialCount("20");
      setEliteCount("25");
      setSeasonCount("15");
      setDescription("");
      setTerms("Garansi Anti Hack-Back Seumur Hidup.");
      setImages([]);
      setSkins([]);
      setHeroes([]);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const prodId = product?.id || "temp";
    const res = await uploadAccountScreenshot(file, prodId);
    if (res.url) {
      setImages((prev) => [...prev, res.url!]);
    }
    setUploadingImage(false);
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImages((prev) => [...prev, imageUrlInput.trim()]);
      setImageUrlInput("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddSkin = () => {
    if (!newSkinHero.trim() || !newSkinName.trim()) return;
    const newSkin: ProductSkin = {
      id: crypto.randomUUID(),
      product_id: product?.id || "",
      hero_name: newSkinHero.trim(),
      skin_name: newSkinName.trim(),
      skin_type: newSkinType,
    };
    setSkins((prev) => [...prev, newSkin]);
    setNewSkinHero("");
    setNewSkinName("");
  };

  const handleRemoveSkin = (id: string) => {
    setSkins((prev) => prev.filter((s) => s.id !== id));
  };

  const handleAddHero = () => {
    if (!newHeroName.trim()) return;
    const newHero: ProductHero = {
      id: crypto.randomUUID(),
      product_id: product?.id || "",
      hero_name: newHeroName.trim(),
    };
    setHeroes((prev) => [...prev, newHero]);
    setNewHeroName("");
  };

  const handleRemoveHero = (id: string) => {
    setHeroes((prev) => prev.filter((h) => h.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const generatedSlug =
        slug.trim() ||
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

      const payload: Partial<Product> = {
        id: product?.id,
        name: name.trim(),
        slug: generatedSlug,
        description: description.trim(),
        price: Number(price) || 0,
        original_price: originalPrice ? Number(originalPrice) : undefined,
        status,
        featured,
        level: Number(level) || 30,
        rank,
        server: server.trim(),
        battle_id: battleId.trim(),
        win_rate: Number(winRate) || 50,
        total_matches: Number(totalMatches) || 0,
        hero_count: Number(heroCount) || 0,
        skin_count: Number(skinCount) || 0,
        collector_count: Number(collectorCount) || 0,
        legend_count: Number(legendCount) || 0,
        epic_count: Number(epicCount) || 0,
        special_count: Number(specialCount) || 0,
        elite_count: Number(eliteCount) || 0,
        season_skin_count: Number(seasonCount) || 0,
        terms: terms.trim(),
        primary_image: images[0] || undefined,
        images: images.map((url, idx) => ({
          id: `img-${idx}`,
          product_id: product?.id || "",
          image_url: url,
          sort_order: idx,
          is_primary: idx === 0,
        })),
        skins,
        heroes,
      };

      const saved = await saveProduct(payload);
      onSuccess(saved);
      onClose();
    } catch (err) {
      console.error("Save product failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-background/80 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-card border border-border shadow-2xl overflow-hidden">
        {/* Sticky Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/70 p-5 bg-card/95 backdrop-blur-md shrink-0">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
              {isEdit ? "Edit Akun Mobile Legends" : "Tambah Akun Mobile Legends Baru"}
            </h3>
            <p className="text-xs text-muted-foreground font-mono">
              Isi spesifikasi lengkap akun untuk ditampilkan di katalog marketplace.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          id="product-form"
          onSubmit={handleSubmit}
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-xs overscroll-contain"
        >
          {/* SECTION 1: BASIC INFO */}
          <div className="space-y-3">
            <h4 className="font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-1.5 text-xs text-primary">
              <Gamepad2 className="w-4 h-4" /> Informasi Utama Akun
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-foreground">
                  Nama Akun MLBB <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: MLBB Sultan Account - 12 Collector + 5 Legend"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">
                  Harga Jual (IDR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  placeholder="2500000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Harga Asli / Coret (Opsional)</label>
                <input
                  type="number"
                  placeholder="3000000"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Status Akun</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AccountStatus)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary focus:outline-none font-semibold cursor-pointer"
                >
                  <option value="available">🟢 Tersedia (Available)</option>
                  <option value="reserved">🟡 Reserved / Booking</option>
                  <option value="sold">🔴 Terjual (Sold Out)</option>
                  <option value="inactive">⚪ Nonaktif</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="featured"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-border w-4 h-4 text-primary cursor-pointer"
                />
                <label htmlFor="featured" className="font-semibold text-foreground cursor-pointer">
                  Tandai sebagai Akun Rekomendasi (HOT / Featured)
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 2: STATS & RANK */}
          <div className="space-y-3 pt-3 border-t border-border/70">
            <h4 className="font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-1.5 text-xs text-amber-400">
              <Trophy className="w-4 h-4" /> Spesifikasi Rank & In-Game
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Rank Tertinggi / Saat Ini</label>
                <select
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary font-medium"
                >
                  {RANKS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Level Akun</label>
                <input
                  type="number"
                  placeholder="75"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Server ID</label>
                <input
                  type="text"
                  placeholder="1234"
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Battle ID</label>
                <input
                  type="text"
                  placeholder="123456789"
                  value={battleId}
                  onChange={(e) => setBattleId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">All Season Win Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="68.5"
                  value={winRate}
                  onChange={(e) => setWinRate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Total Matches</label>
                <input
                  type="number"
                  placeholder="4850"
                  value={totalMatches}
                  onChange={(e) => setTotalMatches(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: CONTENT COUNTS */}
          <div className="space-y-3 pt-3 border-t border-border/70">
            <h4 className="font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-1.5 text-xs text-purple-400">
              <Sparkles className="w-4 h-4" /> Rincian Jumlah Skin & Hero
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-muted-foreground">Total Hero</label>
                <input
                  type="number"
                  value={heroCount}
                  onChange={(e) => setHeroCount(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground">Total Skin</label>
                <input
                  type="number"
                  value={skinCount}
                  onChange={(e) => setSkinCount(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-amber-400 font-semibold">Collector Skin</label>
                <input
                  type="number"
                  value={collectorCount}
                  onChange={(e) => setCollectorCount(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-amber-600/50 text-xs font-mono text-amber-300 font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-purple-400 font-semibold">Legend Skin</label>
                <input
                  type="number"
                  value={legendCount}
                  onChange={(e) => setLegendCount(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-purple-600/50 text-xs font-mono text-purple-300 font-bold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground">Epic Skin</label>
                <input
                  type="number"
                  value={epicCount}
                  onChange={(e) => setEpicCount(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground">Special Skin</label>
                <input
                  type="number"
                  value={specialCount}
                  onChange={(e) => setSpecialCount(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground">Elite Skin</label>
                <input
                  type="number"
                  value={eliteCount}
                  onChange={(e) => setEliteCount(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-muted-foreground">Season Skin</label>
                <input
                  type="number"
                  value={seasonCount}
                  onChange={(e) => setSeasonCount(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: SCREENSHOTS */}
          <div className="space-y-3 pt-3 border-t border-border/70">
            <h4 className="font-bold text-foreground uppercase tracking-wider font-mono flex items-center gap-1.5 text-xs">
              <Upload className="w-4 h-4 text-emerald-400" /> Screenshot Akun (Storage)
            </h4>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Tempel URL Gambar Screenshot..."
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-background border border-border text-xs"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80"
              >
                Tambah URL
              </button>
              <label className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold cursor-pointer hover:bg-primary/90 flex items-center justify-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingImage ? "Uploading..." : "Upload File"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[16/10] rounded-xl overflow-hidden border border-border group"
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    {idx === 0 && (
                      <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-amber-500 text-zinc-950 font-bold text-[9px]">
                        Primary
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-md bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 5: SKINS & HEROES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border/70">
            {/* Skin Item Adder */}
            <div className="space-y-2">
              <span className="font-bold text-foreground uppercase tracking-wider font-mono text-[11px]">
                Daftar Skin Terkatalog
              </span>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Hero"
                  value={newSkinHero}
                  onChange={(e) => setNewSkinHero(e.target.value)}
                  className="w-24 px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs"
                />
                <input
                  type="text"
                  placeholder="Nama Skin"
                  value={newSkinName}
                  onChange={(e) => setNewSkinName(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs"
                />
                <select
                  value={newSkinType}
                  onChange={(e) => setNewSkinType(e.target.value as SkinType)}
                  className="px-2 py-1.5 rounded-lg bg-background border border-border text-xs"
                >
                  {SKIN_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddSkin}
                  className="p-2 rounded-lg bg-primary text-primary-foreground"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {skins.map((s) => (
                  <span
                    key={s.id}
                    className="px-2 py-1 rounded-md bg-secondary text-[11px] flex items-center gap-1"
                  >
                    {s.hero_name} - {s.skin_name} ({s.skin_type})
                    <button
                      type="button"
                      onClick={() => handleRemoveSkin(s.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Hero Item Adder */}
            <div className="space-y-2">
              <span className="font-bold text-foreground uppercase tracking-wider font-mono text-[11px]">
                Hero Unggulan
              </span>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Nama Hero (Gusion, Fanny, Chou)..."
                  value={newHeroName}
                  onChange={(e) => setNewHeroName(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-background border border-border text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddHero}
                  className="p-2 rounded-lg bg-primary text-primary-foreground"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {heroes.map((h) => (
                  <span
                    key={h.id}
                    className="px-2 py-1 rounded-md bg-secondary text-[11px] flex items-center gap-1"
                  >
                    {h.hero_name}
                    <button
                      type="button"
                      onClick={() => handleRemoveHero(h.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 6: DESCRIPTION & TERMS */}
          <div className="space-y-3 pt-3 border-t border-border/70">
            <div className="space-y-1">
              <label className="font-semibold text-foreground">Deskripsi Lengkap Akun</label>
              <textarea
                rows={3}
                placeholder="Jelaskan keunggulan akun, emblem level, item langka, dll..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground">Ketentuan & Garansi Pembelian</label>
              <textarea
                rows={2}
                placeholder="Garansi anti hack-back, Moonton sepaket..."
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs"
              />
            </div>
          </div>
        </form>

        {/* Sticky Modal Footer */}
        <div className="sticky bottom-0 z-20 flex justify-end gap-3 p-4 border-t border-border bg-card/95 backdrop-blur-md shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/80 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            form="product-form"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span>{isEdit ? "Simpan Perubahan" : "Publikasikan Akun"}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
